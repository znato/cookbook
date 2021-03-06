package hu.gdf.szgd.dishbrary.transformer;

import hu.gdf.szgd.dishbrary.StaticResourceComponentType;
import hu.gdf.szgd.dishbrary.db.entity.Right;
import hu.gdf.szgd.dishbrary.db.entity.Role;
import hu.gdf.szgd.dishbrary.db.entity.User;
import hu.gdf.szgd.dishbrary.security.DishbraryUser;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
@Log4j2
public class UserTransformer {

	public static String PROFILE_IMG_BASE_URL = "/rest/resource/image/" + StaticResourceComponentType.USER.name().toLowerCase() + "/";

	@Autowired
	private GenericReflectionBasedTransformer genericTransformer;

	public DishbraryUser transformUser(User user) {
		return transformUser(user, null);
	}

	public DishbraryUser transformUser(User user, TransformerConfig config) {
		log.debug("Transfomr user: id[{}], username[{}]", user.getId(), user.getUsername());

		DishbraryUser dishbraryUser = genericTransformer.transform(user, new DishbraryUser(), config);

		if (StringUtils.hasText(user.getProfileImageFileName())) {
			dishbraryUser.setProfileImageUrl(PROFILE_IMG_BASE_URL + user.getId() + "/" + user.getProfileImageFileName());
		}

		if (!TransformerConfig.isFieldExcludedInConfig(config, "grantedAuthorities")) {
			dishbraryUser.setGrantedAuthorities(mapRoleForUser(user));
		}

		return dishbraryUser;
	}

	public User transformForUpdate(User userToUpdate, DishbraryUser newData) {
		userToUpdate.setUsername(newData.getUsername());
		userToUpdate.setFirstName(newData.getFirstName());
		userToUpdate.setLastName(newData.getLastName());
		userToUpdate.setEmail(newData.getEmail());

		if (StringUtils.hasText(newData.getPassword())) {
			userToUpdate.setPassword(newData.getPassword());
		}

		return userToUpdate;
	}

	public User transformDishbraryUser(DishbraryUser dishbraryUser) {
		return genericTransformer.transform(dishbraryUser, new User());
	}

	private List<GrantedAuthority> mapRoleForUser(User user) {
		List<GrantedAuthority> grantedAuthorities;

		Role role = user.getRole();

		if (role != null && !CollectionUtils.isEmpty(role.getRights())) {
			List<Right> rights = role.getRights();
			grantedAuthorities = new ArrayList<>(rights.size() + 1);

			String roleName = "ROLE_" + role.getName();
			log.debug("User[{}] has role: {}", user.getUsername(), roleName);

			grantedAuthorities.add(new SimpleGrantedAuthority(roleName));

			rights.forEach(right -> {
				String rightName = right.getName();
				log.debug("User[{}] has right: {}", user.getUsername(), rightName);

				grantedAuthorities.add(new SimpleGrantedAuthority(rightName));
			});
		} else {
			log.debug("Empty role/right set found for user: {}", user.getUsername());
			grantedAuthorities = Collections.emptyList();
		}

		return grantedAuthorities;
	}
}
