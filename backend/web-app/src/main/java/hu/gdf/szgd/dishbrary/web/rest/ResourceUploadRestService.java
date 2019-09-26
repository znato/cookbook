package hu.gdf.szgd.dishbrary.web.rest;

import hu.gdf.szgd.dishbrary.service.StaticResourceService;
import hu.gdf.szgd.dishbrary.web.model.DishbraryResponse;
import hu.gdf.szgd.dishbrary.web.model.FileResource;
import org.glassfish.jersey.media.multipart.BodyPart;
import org.glassfish.jersey.media.multipart.BodyPartEntity;
import org.glassfish.jersey.media.multipart.FormDataMultiPart;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

import static hu.gdf.szgd.dishbrary.web.WebConstants.JSON_WITH_UTF8_ENCODING;

@Service
@Path("/resource/")
@Consumes({MediaType.MULTIPART_FORM_DATA})
@Produces(JSON_WITH_UTF8_ENCODING)
public class ResourceUploadRestService {

	@Autowired
	private StaticResourceService staticResourceService;

	@POST
	@Path("recipe/{recipeId}/image/upload")
	@PreAuthorize("hasAuthority('WRITE_RECIPE')")
	public Response upload(@PathParam("recipeId") Long recipeId,
						   @FormDataParam("selectedCoverImageFileName") String selectedCoverImageFileName,
						   final FormDataMultiPart multiPart) {

		List<BodyPart> bodyParts = multiPart.getBodyParts();
		List<FileResource> fileResources = new ArrayList<>(bodyParts.size());

		for (BodyPart bodyPart : bodyParts) {
			String fileName = bodyPart.getContentDisposition().getFileName();

			//if filename is not filled ignore the bodypart (it can be null for non image entries like selectedCoverImageFileName which appended manually)
			if (fileName == null) {
				continue;
			}

			BodyPartEntity bodyPartEntity = (BodyPartEntity) bodyPart.getEntity();

			fileResources.add(new FileResource(fileName, bodyPartEntity.getInputStream()));
		}

		staticResourceService.uploadRecipeImages(recipeId, selectedCoverImageFileName, fileResources);

		return Response.ok(new DishbraryResponse<>("A kép(ek) sikeresen mentve!")).build();
	}
}
