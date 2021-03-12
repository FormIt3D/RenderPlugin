RenderPlugin = {};

RenderPlugin.getAllRenderInfo = function(args, callback) {
    function getSceneData() {
        // Helper function to return the material index from a given WSM object
        function MakeMaterialAndReturnIndex(currentHistID, objID, materialNameToIndexMap, materialVec)
        {
            var materialIndex = -1;
            var matID = WSM.APIGetObjectMaterialReadOnly(currentHistID, objID);
            if (matID != WSM.INVALID_ID)
            {                               
                var materialData = WSM.APIGetMaterialDataReadOnly(currentHistID, matID);
                if (Object.keys(materialNameToIndexMap).indexOf(materialData.sMaterialName) == -1)
                {
                    // Add the material since it was not previously added.
                    materialNameToIndexMap[materialData.sMaterialName] = materialVec.length;
                    var material = new Object();
                    material.sMaterialName = materialData.sMaterialName;
                    material.nColor = materialData.nColor;
                    material.bitmap = [];
                    material.opacityMap = [];
                    material.normalMap = [];
                    material.r0 = 0;
                    material.r90 = 0;
                    material.g = 0;
                    
                    if (materialData.nTextureID != WSM.INVALID_ID)
                    {
                        var textureData = WSM.APIGetTextureDataReadOnly(currentHistID, materialData.nTextureID);
                        material.bitmap = textureData.bitmap;
                    }
                    
                    if (materialData.aAdditionalTextures.length > 0)
                    {
                        for (var i = 0; i < materialData.aAdditionalTextures.length; i++)
                        {
                            if (materialData.aAdditionalTextures[i]["first"] == "opacityMap" ||
                                materialData.aAdditionalTextures[i]["first"] == "normalMap")
                            {                            
                                var textureData = WSM.APIGetTextureDataReadOnly(currentHistID, materialData.aAdditionalTextures[i]["second"]);
                                material[materialData.aAdditionalTextures[i]["first"]] = textureData.bitmap;
                            }               
                        }
                    }
                    
                    if (materialData.aAdditionalRenderData.length > 0)
                    {
                        for (var i = 0; i < materialData.aAdditionalRenderData.length; i++)
                        {
                            if (materialData.aAdditionalRenderData[i]["first"] == "r0" ||
                                materialData.aAdditionalRenderData[i]["first"] == "r90" ||
                                materialData.aAdditionalRenderData[i]["first"] == "g")
                            {                            
                                material[materialData.aAdditionalRenderData[i]["first"]] = parseFloat(materialData.aAdditionalRenderData[i]["second"]);
                            }               
                        }
                    }
                    
                    materialVec.push(material);
                }
                
                materialIndex = materialNameToIndexMap[materialData.sMaterialName];
            }   
            
            return materialIndex;
        }

        // DEBUG function that makes a WSM material from JSON data and applies it to the given object.
        function MakeWSMMaterialAndApplyToObject(histID, objID, materialIndex, materialVec, materialIndexToIDMap)
        {
            if (materialIndex >= 0)
            {       
                var materialID = WSM.INVALID_ID;                
                if (Object.keys(materialIndexToIDMap).indexOf(String(materialIndex)) == -1)
                {
                    // Create the material for this refHistID
                    var nTextureID = WSM.INVALID_ID;;
                    if (materialVec[materialIndex].bitmap.length > 0)
                    {
                        nTextureID = WSM.APICreateTexture(histID, materialVec[materialIndex].bitmap);
                    }
                    
                    additionalData = [];
                    if (materialVec[materialIndex].r0 > 0)
                    {
                        var r0Pair = new Object();
                        r0Pair.first = "r0";
                        r0Pair.second = JSON.stringify(materialVec[materialIndex].r0);
                        additionalData.push(r0Pair);
                    }

                    if (materialVec[materialIndex].r90 > 0)
                    {
                        var r90Pair = new Object();
                        r90Pair.first = "r90";
                        r90Pair.second = JSON.stringify(materialVec[materialIndex].r90);
                        additionalData.push(r90Pair);
                    }
                    
                    if (materialVec[materialIndex].g > 0)
                    {
                        var gPair = new Object();
                        gPair.first = "g";
                        gPair.second = JSON.stringify(materialVec[materialIndex].g);
                        additionalData.push(gPair);
                    }
                    
                    additionalTextures = [];
                    if (materialVec[materialIndex].opacityMap.length > 0)
                    {
                        var opacityMapID = WSM.APICreateTexture(histID, materialVec[materialIndex].opacityMap);
                        var opacityMapPair = new Object();
                        opacityMapPair.first = "opacityMap";
                        opacityMapPair.second = opacityMapID;
                        additionalTextures.push(opacityMapPair);                
                    }

                    if (materialVec[materialIndex].normalMap.length > 0)
                    {
                        var normalMapID = WSM.APICreateTexture(histID, materialVec[materialIndex].normalMap);
                        var normalMapPair = new Object();
                        normalMapPair.first = "normalMap";
                        normalMapPair.second = normalMapID;
                        additionalTextures.push(normalMapPair);                
                    }

                    materialID = WSM.APICreateMaterial(histID, materialVec[materialIndex].nColor, 1.0, 1.0, 
                                                    nTextureID, materialVec[materialIndex].sMaterialName, "", additionalData, additionalTextures);                    
                    materialIndexToIDMap[materialIndex] = materialID; 
                }

                materialID = materialIndexToIDMap[materialIndex];
                WSM.APISetObjectsMaterial(histID, objID, materialID);               
            }
        }

        //var result = true; 
        var mainHistID = 0;//WSM.APIGetActiveHistory(); 
        
        
        // Look at geometry in all reachable Histories.
        var allHistIDs = WSM.APIGetAllHistoriesReadOnly(false);
        var meshTransformVec = [];
        
        // Map of the material name to the index of the material in materialVec.
        var materialNameToIndexMap = new Object();
        var materialVec = [];
            
        for (var i = 0; i < allHistIDs.length; i++)
        {       
            var currentHistID = allHistIDs[i];
            var transforms = [];
            var materialForTransforms = [];
            
            if (currentHistID == mainHistID)
            {
                // Add the identity transform
                transforms.push(WSM.Geom.Transf3d(WSM.Geom.Point3d(0, 0, 0), WSM.Geom.Vector3d(1, 0, 0), WSM.Geom.Vector3d(0, 1, 0), WSM.Geom.Vector3d(0, 0, 1)));
                
                // Use the default face color here.
                materialForTransforms.push(-1);
            }
            else
            {
                // Get all the transforms from the main history to the current history. This could be empty in which case the history is not reachable.
                var output = WSM.APIGetAllAggregateTransf3dsReadOnly(currentHistID, mainHistID);                        
                for (var j = 0; j < output.paths.length; j++)
                {
                    var isHidden = WSM.Utils.IsTopLevelObjectHiddenByPath(output.paths[j]);             
                    if (isHidden == true)
                    {
                        continue;
                    }
                    
                    // Don't keep anthing below a hidden instance.
                    transforms.push(output.transforms[j]);
                
                    var materialIndex = -1;
                    for (var k = output.paths[j].ids.length - 1; k > -1 ; k--)
                    {
                        materialIndex = MakeMaterialAndReturnIndex(output.paths[j].ids[k]["History"], 
                                                                output.paths[j].ids[k]["Object"], materialNameToIndexMap, materialVec);
                        if (materialIndex != -1)
                        {
                            break;
                        }                       
                    }
                    materialForTransforms.push(materialIndex);
                }
                
                if (transforms.length == 0)
                {
                    continue;
                }
            }
            
            // The meshes for all the faces.
            var meshes = [];
            
            var nonownedIDs = WSM.APIGetAllNonOwnedReadOnly(currentHistID);
            for (var kk = 0; kk < nonownedIDs.length; kk++)
            {
                var objectType = WSM.APIGetObjectTypeReadOnly(currentHistID, nonownedIDs[kk]);
                if (objectType != WSM.nBodyType && objectType != WSM.nFaceType && objectType != WSM.nMeshType)
                {
                    continue;
                }
                
                var isHidden = WSM.Utils.IsTopLevelObjectHidden(currentHistID, nonownedIDs[kk]);                
                if (isHidden == true)
                {
                    continue;
                }
                            
                if (objectType == WSM.nMeshType)
                {
                    // Collect all the rendering data per mesh.
                    var meshData = WSM.APIGetMeshDataReadOnly(currentHistID, nonownedIDs[kk]);
                    var faceMesh = new Object();
                    faceMesh.indices = meshData.triangles;
                    faceMesh.vertices = meshData.points;
                    faceMesh.normals = meshData.normals;
                    faceMesh.uvs = meshData.uvs;

                    var materialIndex = MakeMaterialAndReturnIndex(currentHistID, nonownedIDs[kk], materialNameToIndexMap, materialVec);                
                    faceMesh.materialIndex = materialIndex;
                    meshes.push(faceMesh);                              
                }
                else
                {
                    var faceIDs = WSM.APIGetObjectsByTypeReadOnly(currentHistID, nonownedIDs[kk], WSM.nFaceType);       
                    for (var j = 0; j < faceIDs.length; j++)
                    {
                        // Collect all the rendering data per face in one set of arrays.
                        var faceMesh = new Object();
                        faceMesh.indices = [];
                        faceMesh.vertices = [];
                        faceMesh.normals = [];
                        faceMesh.uvs = [];

                        var renderableData = WSM.APIGetRenderableFaceReadOnly(currentHistID, faceIDs[j], true, false);
                        if (renderableData.vertices.length == renderableData.normals.length)
                        {
                            for (var k = 0; k < renderableData.vertices.length; k++)
                            {
                                faceMesh.indices.push(k);
                                faceMesh.vertices.push(renderableData.vertices[k].x);
                                faceMesh.vertices.push(renderableData.vertices[k].y);
                                faceMesh.vertices.push(renderableData.vertices[k].z);
                                faceMesh.normals.push(renderableData.normals[k].x);
                                faceMesh.normals.push(renderableData.normals[k].y);
                                faceMesh.normals.push(renderableData.normals[k].z);
                                if (renderableData.vertices.length == renderableData.texCoords.length)
                                {                   
                                    faceMesh.uvs.push(renderableData.texCoords[k].x);
                                    faceMesh.uvs.push(renderableData.texCoords[k].y);
                                }
                            }
                        
                            // Get the material from the face if we haven't seen it yet.
                            var materialIndex = MakeMaterialAndReturnIndex(currentHistID, faceIDs[j], materialNameToIndexMap, materialVec);             
                            faceMesh.materialIndex = materialIndex;
                            meshes.push(faceMesh);              
                        }
                    }
                }
            }
            
            // Each history gets a vector of meshes and a vector of transforms.
            var meshTransform = new Object();
            meshTransform.transforms = transforms;
            meshTransform.meshes = meshes;
            meshTransform.materialForTransforms = materialForTransforms;
            meshTransformVec.push(meshTransform);
        }

        //console.log(JSON.stringify(meshTransformVec));
        //console.log(JSON.stringify(materialVec));
        //console.log(JSON.stringify(materialNameToIndexMap));
        return {
            meshTransformVec: meshTransformVec,
            materialVec: materialVec
        };
    }

    const sceneData = getSceneData();

    const cameraData = FormIt.Cameras.GetCameraData();
    const worldUp = FormIt.Cameras.GetCameraWorldUp();
    const worldForward = FormIt.Cameras.GetCameraWorldForward();

    var sunLocationData = FormIt.SunAndLocation.GetLocationDateTime();
    var sunVector = FormIt.SunAndLocation.GetLightDirectionFromLocationData(sunLocationData);

    const lights = [];

    const mainHistID = 0;
    const lightAttrKey = 'RenderPlugin::Light'

    const objectsToCheck = WSM.APIGetAllObjectsByTypeReadOnly(mainHistID, WSM.nInstanceType);

    objectsToCheck.forEach( function(objectId, index){
        const res = WSM.Utils.GetStringAttributeForObject(mainHistID, objectId, lightAttrKey);

        if (res.success){
            const boundingBox = WSM.APIGetBoxReadOnly(0, objectId);
            const location = boundingBox.lower;

            const data = JSON.parse(res.value);

            var r = parseInt(data.color.substr(1,2), 16)
            var g = parseInt(data.color.substr(3,2), 16)
            var b = parseInt(data.color.substr(5,2), 16)
            console.log(`red: ${r}, green: ${g}, blue: ${b}`)

            lights.push({
                x: location.x,
                y: location.y,
                z: location.z,
                type: data.type || 'point',
                color: {
                    r: r/255,
                    g: g/255,
                    b: b/255
                },
                intensity: data.intensity || 80,
                radius: 0, //https://docs.arnoldrenderer.com/display/A5AFMUG/Point+Light
                name: 'lightName-' + index
            });
        }
    });

    cameraData.worldUp = worldUp;
    cameraData.worldForward = worldForward;

    const allData = {
        meshTransformVec: sceneData.meshTransformVec,
        materialVec: sceneData.materialVec,
        cameraData: cameraData,
        sunVec : sunVector,
        lights: lights
    };

    //console.log(JSON.stringify(allData));

    return allData;
}