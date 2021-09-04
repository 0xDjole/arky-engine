USE system;
DROP KEYSPACE IF EXISTS tox;
CREATE KEYSPACE tox WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1 };
USE tox;

CREATE TABLE IF NOT EXISTS tox.permissions_by_category (
    category_id text,
    category_name text STATIC, 
    category_image text STATIC, 
    category_created_at timestamp STATIC,
    category_permission_id text,
    category_permission_feature text,
    category_permission_action text,
    PRIMARY KEY ((category_id), category_permission_id)
);

CREATE TABLE IF NOT EXISTS tox.permission_user_lookup ( 
    user_id text,
    permission_id text,
    minute_id timeuuid,
    PRIMARY KEY ((user_id, permission_id), minute_id)
);

CREATE TABLE IF NOT EXISTS tox.permission_minutes_by_user ( 
    user_id text, 
    minute_id timeuuid,
    PRIMARY KEY(user_id, minute_id)
);

CREATE TABLE IF NOT EXISTS tox.permissions_by_access_token (
    token_access_token text,
    token_refresh_token text,
    token_openid_token text, 
    token_provider text,
    token_type text,
    token_expires_at timestamp,
    user_id text,
    user_email text,
    user_name text, 
    user_image text, 
    user_created_at timestamp,
    permission_category_id text,
    permission_category_name text, 
    permission_category_image text, 
    permission_category_created_at timestamp,
    permission_id text,
    permission_feature text,
    permission_action text,
    PRIMARY KEY ((token_access_token, permission_id))
);

CREATE TABLE IF NOT EXISTS tox.permissions_by_refresh_token (
    token_refresh_token text,
    token_access_token text,
    token_openid_token text,
    token_provider text,
    token_type text,
    token_expires_at timestamp,
    user_id text,
    user_email text,
    user_name text, 
    user_image text, 
    user_created_at timestamp,
    permission_category_id text,
    permission_category_name text, 
    permission_category_image text, 
    permission_category_created_at timestamp,
    permission_id text,
    permission_feature text,
    permission_action text,
    PRIMARY KEY ((token_refresh_token, permission_id))
);

CREATE TABLE IF NOT EXISTS tox.permissions_by_user ( 
    user_id text,
    minute_id timeuuid,
    user_email text,
    user_name text, 
    user_image text, 
    user_created_at timestamp,
    permission_category_id text,
    permission_category_name text, 
    permission_category_image text, 
    permission_category_created_at timestamp,
    permission_id text,
    permission_feature text,
    permission_action text,
    PRIMARY KEY ((user_id, minute_id), permission_id)
) WITH CLUSTERING ORDER BY (permission_id DESC);

CREATE TABLE IF NOT EXISTS tox.user_minutes_by_permission ( 
    permission_id text, 
    minute_id timeuuid,
    PRIMARY KEY(permission_id, minute_id)
);

CREATE TABLE IF NOT EXISTS tox.users_by_permission ( 
    permission_id text,
    permission_feature text,
    permission_action text,
    permission_category_id text,
    permission_category_name text, 
    permission_category_image text, 
    permission_category_created_at timestamp,
    user_id text,
    user_email text,
    user_name text, 
    user_image text, 
    user_created_at timestamp,
    minute_id timeuuid,
    PRIMARY KEY ((permission_id, minute_id), user_id)
) WITH CLUSTERING ORDER BY (user_id DESC);

CREATE TABLE IF NOT EXISTS tox.categories_by_post (
    post_id text,
    category_id text,
    post_name text, 
    post_latitude float,
    post_longitude float,
    post_image text,
    post_address text,
    post_city text,
    post_country text,
    post_created_at timestamp,
    post_category_group int,
    category_name text, 
    category_image text,
    category_created_at timestamp,
    PRIMARY KEY ((post_id), category_id)
);

CREATE TABLE IF NOT EXISTS tox.post_category_lookup ( 
    category_id text, 
    post_id text,
    minute_id timeuuid,
    PRIMARY KEY((category_id, post_id))
);

CREATE TABLE IF NOT EXISTS tox.post_minutes_by_category ( 
    category_id text, 
    minute_id timeuuid,
    PRIMARY KEY(category_id, minute_id)
);

CREATE TABLE IF NOT EXISTS tox.posts_by_category ( 
    category_id text,
    minute_id timeuuid,
    post_id text,
    category_name text, 
    category_image text,
    category_created_at timestamp,
    post_name text, 
    post_latitude float,
    post_longitude float,
    post_image text,
    post_address text,
    post_city text,
    post_country text,
    post_created_at timestamp,
    PRIMARY KEY ((category_id, minute_id), post_id)
);

CREATE TABLE IF NOT EXISTS tox.feeds_by_category_and_user ( 
    user_id text,
    category_id text,
    feed_id text,
    PRIMARY KEY ((user_id, category_id), feed_id)
);

CREATE TABLE IF NOT EXISTS tox.categories_by_feed ( 
    feed_id text,
    category_id text,
    PRIMARY KEY ((feed_id), category_id)
) WITH CLUSTERING ORDER BY (category_id DESC);

CREATE TABLE IF NOT EXISTS tox.post_days_by_feed ( 
    feed_id text,
    user_id text,
    day timestamp,
    PRIMARY KEY ((feed_id, user_id), day)
) WITH CLUSTERING ORDER BY (day DESC);

CREATE TABLE IF NOT EXISTS tox.posts_by_feed ( 
    feed_id text,
    day timestamp,
    post_id text,
    post_name text, 
    post_latitude float,
    post_longitude float,
    post_image text, 
    post_address text,
    post_city text,
    post_country text,
    post_created_at timestamp,
    post_category_id text,
    post_category_name text, 
    post_category_image text,
    post_category_created_at timestamp,
    PRIMARY KEY ((feed_id, day), post_created_at, post_category_id, post_id)
) WITH CLUSTERING ORDER BY (post_created_at DESC);

CREATE TABLE IF NOT EXISTS tox.feed_days_by_post ( 
    post_id text,
    day text,
    PRIMARY KEY ((post_id), day)
);

CREATE TABLE IF NOT EXISTS tox.feeds_by_post ( 
    post_id text,
    day timestamp,
    feed_id text,
    user_id text,
    PRIMARY KEY ((post_id, day), feed_id)
);
