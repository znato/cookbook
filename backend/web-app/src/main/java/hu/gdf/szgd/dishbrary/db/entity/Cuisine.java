package hu.gdf.szgd.dishbrary.db.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
@Getter
@Setter
public class Cuisine extends AbstractEntity {

	@Column
	private String name;
	@Column
	private String iconFileName;

}
