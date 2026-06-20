insert into users (email,fname,lname,isadmin) values ('John@Post.com','John','Post', false);
insert into user_password (user_id,password) values (1,'$2a$12$CQvn.eF7E.LAChjtyI/k3ui3egXX.xW67Bw96Wy9mtt5dqimuDomi');
insert into locations (category, geo) values ('point', ST_GeomFromText('POINT(25.273361206054688 54.69119771827091)', 4326));
insert into forum_posts (user_id,location_id,content,title) values (1,1,'Johns first post in this forum','John post owns this website');
insert into forum_comments (user_id,forum_post_id,content) values (1,1,'John post likes to comment on his own posts.');

insert into users (email,fname,lname,isadmin) values ('admin@admin', 'admin', 'admin', true);
insert into user_password (user_id, password) values (2, '$2a$10$oXYxGgCJfD0Us/nMgM/LJ../ky9Ge0QqE9iKxvTtgbkMYxZ7rxWua');
