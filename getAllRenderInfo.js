export default async function getAllRenderInfo() 
{
    var mainHistID = await WSM.APIGetActiveHistory();	
	
	// Look at geometry in all reachable Histories.
	var allHistIDs = await WSM.APIGetAllHistoriesReadOnly(false);

	var meshTransformVec = [];
	
	for (var i = 0; i < allHistIDs.length; i++)
	{		
		var currentHistID = allHistIDs[i];
		var transforms = [];
		
		if (currentHistID == mainHistID)
		{
			// Add the identity transform
			transforms.push(await WSM.Geom.Transf3d(await WSM.Geom.Point3d(0, 0, 0), await WSM.Geom.Vector3d(1, 0, 0), await WSM.Geom.Vector3d(0, 1, 0), await WSM.Geom.Vector3d(0, 0, 1)));
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
		}

		// Collect all the rendering data in one set of arrays.
		var indices = [];
		var vertices = [];
		var normals = [];
		var uvs = [];

		var faceIDs = await WSM.APIGetAllObjectsByTypeReadOnly(currentHistID, WSM.nFaceType);		
		for (var j = 0; j < faceIDs.length; j++)
		{
			var renderableData = await WSM.APIGetRenderableFaceReadOnly(currentHistID, faceIDs[j], true, false);
			var indexOffset = indices.length;
			if (renderableData.vertices.length == renderableData.normals.length)
			{
				for (var k = 0; k < renderableData.vertices.length; k++)
				{
					indices.push(k + indexOffset);
					vertices.push(renderableData.vertices[k].x);
					vertices.push(renderableData.vertices[k].y);
					vertices.push(renderableData.vertices[k].z);
					normals.push(renderableData.normals[k].x);
					normals.push(renderableData.normals[k].y);
					normals.push(renderableData.normals[k].z);
					if (renderableData.vertices.length == renderableData.texCoords.length)
					{					
						uvs.push(renderableData.texCoords[k].x);
						uvs.push(renderableData.texCoords[k].y);
					}
				}
			}
		}
		
		// Each history gets a mesh and with transforms. Need to break this up further for materials.
		var meshTransform = new Object();
		meshTransform.transforms = transforms;
		meshTransform.indices = indices;
		meshTransform.vertices = vertices;
		meshTransform.normals = normals;
		meshTransform.uvs = uvs;
		meshTransformVec.push(meshTransform);
		//console.log(JSON.stringify(meshTransform));
	}

    return meshTransformVec;
}