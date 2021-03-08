
// Helper function to return the material index from a given WSM object
async function MakeMaterialAndReturnIndex(currentHistID, objID, materialNameToIndexMap, materialVec)
{
	var materialIndex = -1;
	var matID = await WSM.APIGetObjectMaterialReadOnly(currentHistID, objID);
	if (matID != WSM.INVALID_ID)
	{							    
		var materialData = await WSM.APIGetMaterialDataReadOnly(currentHistID, matID);
		if (Object.keys(materialNameToIndexMap).indexOf(materialData.sMaterialName) == -1)
		{
			// Add the material since it was not previously added.
			materialNameToIndexMap[materialData.sMaterialName] = materialVec.length;
			var material = new Object();
			material.sMaterialName = materialData.sMaterialName;
			material.nColor = materialData.nColor;
			material.bitmap = "";
			if (materialData.nTextureID != WSM.INVALID_ID)
			{
				var textureData = await WSM.APIGetTextureDataReadOnly(currentHistID, materialData.nTextureID);
				material.bitmap = textureData.bitmap;
			}
			materialVec.push(material);
		}
		
		materialIndex = materialNameToIndexMap[materialData.sMaterialName];
	}	
	
	return materialIndex;
}

async function getSceneData() 
{
    var result = true; 
    //temporarily hacking for a bug. On Web this needs to be 0?
    var mainHistID = 0;
    //temporarily hacking..
    WSM.nFaceType = 4;
	
	// This is just for test - do not keep.
	//FormIt.OpenFile(testPath + "/test1.axm");

	
	// Look at geometry in all reachable Histories.
	var allHistIDs = await WSM.APIGetAllHistoriesReadOnly(false);
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
			transforms.push(await WSM.Geom.Transf3d(await WSM.Geom.Point3d(0, 0, 0), await WSM.Geom.Vector3d(1, 0, 0), await WSM.Geom.Vector3d(0, 1, 0), await WSM.Geom.Vector3d(0, 0, 1)));
			
			// Use the default face color here.
			materialForTransforms.push(-1);
		}
		else
		{
			// Get all the transforms from the main history to the current history. This could be empty in which case the history is not reachable.
			var output = await WSM.APIGetAllAggregateTransf3dsReadOnly(currentHistID, mainHistID);
			transforms = output.transforms;
			if (transforms.length == 0)
			{
				continue;
			}
			
			for (var j = 0; j < output.paths.length; j++)
			{
				var materialIndex = -1;
				for (var k = output.paths[j].ids.length - 1; k > -1 ; k--)
				{
					materialIndex = await MakeMaterialAndReturnIndex(output.paths[j].ids[k]["History"], 
					                                           output.paths[j].ids[k]["Object"], materialNameToIndexMap, materialVec);
                    if (materialIndex != -1)
					{
						break;
					}						
				}
				materialForTransforms.push(materialIndex);
			}
		}
		
		// The meshes for all the faces.
		var meshes = [];

		var faceIDs = await WSM.APIGetAllObjectsByTypeReadOnly(currentHistID, WSM.nFaceType);		
		for (var j = 0; j < faceIDs.length; j++)
		{
			// Collect all the rendering data per face in one set of arrays.
			var faceMesh = new Object();
			faceMesh.indices = [];
			faceMesh.vertices = [];
			faceMesh.normals = [];
			faceMesh.uvs = [];

			var renderableData = await WSM.APIGetRenderableFaceReadOnly(currentHistID, faceIDs[j], true, false);
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
        meshTransformVec,
        materialVec
    }
}

export default async function getAllRenderInfo() 
{
    const sceneData = await getSceneData();

    const cameraData = await FormIt.Cameras.GetCameraData();
    const worldUp = await FormIt.Cameras.GetCameraWorldUp();
    const worldForward = await FormIt.Cameras.GetCameraWorldForward();
    const sunData = {'TODO':'TODO'};
    const lights = [{'TODO':'TODO'}];

    const allData = {
        meshTransformVec: sceneData.meshTransformVec,
        materialVec: sceneData.materialVec,
        cameraData: {
            ...cameraData, 
            worldUp: {...worldUp}, 
            worldForward: {...worldForward}
        },
        sunData,
        lights
    };

    console.log(JSON.stringify(allData));

    return allData;
}