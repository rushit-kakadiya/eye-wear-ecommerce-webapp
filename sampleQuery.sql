select * from frame f order by frame_code;
select * from frame_details fd order by frame_code;
select * from variants v order by variant_code;
select * from sizes sz;
select * from frame_sizes fsz;

select * from frame_master fm order by frame_code;
select * from products p;
select * from product_stocks p;


select * from hto_slot hs;
select * from optician o;
select * from lenses l;

select  'ST', f.frame_code, v.variant_code, s.size_code, 
concat('ST', right(f.frame_code, 4), right(s.size_code, 2), right(v.variant_code, 3)), null,
false,false,
'','','','', current_timestamp, null,1 
from frame f
inner join sizes s on 1=1
inner join variants v on 1=1;


INSERT INTO eyewear.frame_images
(id, sku_code, image_key, image_category, image_type, status)
select image_id, sku_code, image_key, 'image_type', 'image_category', 1 from product_images order by sku_code;


update temp_frame_images set image_category = 'OPTICAL' where substring(image_key, 31, 3) = '_E_';
update temp_frame_images set image_category = 'SUNWEAR' where substring(image_key, 31, 3) = '_S_';
update temp_frame_images set image_type = 'FRAME' where substring(image_key, 31, 6) in 
('_E_0_U', '_E_1_U', '_E_2_U', '_E_3_U', '_E_4_U', '_E_6_U', '_S_0_U', '_S_1_U', '_S_2_U', '_S_3_U', '_S_4_U', '_S_6_U');
update temp_frame_images set image_type = 'MODEL_W' where substring(image_key, 31, 6) in ('_E_5_W', '_S_5_W');
update temp_frame_images set image_type = 'MODEL_M' where substring(image_key, 31, 6) in ('_E_5_M',  '_S_5_M');
update temp_frame_images set image_type = 'MODEL_W_GIF' where right(image_key, 6) = '_W.gif';
update temp_frame_images set image_type = 'MODEL_M_GIF' where right(image_key, 6) = '_M.gif';
update temp_frame_images set 
image_code = case
	when image_type = 'MODEL_M_GIF' and image_category = 'OPTICAL' then 'E_5_M_GIF'
	when image_type = 'MODEL_W_GIF' and image_category = 'OPTICAL' then 'E_5_W_GIF'
	when image_type = 'MODEL_M_GIF' and image_category = 'SUNWEAR' then 'S_5_M_GIF'
	when image_type = 'MODEL_W_GIF' and image_category = 'SUNWEAR' then 'S_5_M_GIF'
	ELSE substring(image_key, 32, 5)
	END;

update temp_frame_images set 
image_order_key  = case
	when image_code = 'E_5_W' then 1
	when image_code = 'E_5_W_GIF' then 2
	when image_code = 'E_5_M' then 3
	when image_code = 'E_5_M_GIF' then 4
	when image_code = 'E_0_U' then 5
	when image_code = 'E_1_U' then 6
	when image_code = 'E_2_U' then 7
	when image_code = 'E_3_U' then 8
	when image_code = 'E_4_U' then 9
	when image_code = 'E_6_U' then 10
	when image_code = 'S_5_W' then 1
	when image_code = 'S_5_W_GIF' then 2
	when image_code = 'S_5_M' then 3
	when image_code = 'S_5_M_GIF' then 4
	when image_code = 'S_0_U' then 5
	when image_code = 'S_1_U' then 6
	when image_code = 'S_2_U' then 7
	when image_code = 'S_3_U' then 8
	when image_code = 'S_4_U' then 9
	when image_code = 'S_6_U' then 10
	ELSE -1
	end;

update temp_frame_images set
	frame_code = fm.frame_code ,
	variant_code = fm.variant_code
from frame_master fm where fm.sku_code = temp_frame_images.sku_code;

select * from frame f order by frame_code;
select * from frame_details fd order by frame_code;
select * from variants v order by variant_code;
select * from sizes sz;
select * from frame_sizes fsz;

select * from frame_master fm order by frame_code;
select * from products p;
select * from product_stocks p;


select * from hto_slot hs;
select * from optician o;
select * from lenses l;
