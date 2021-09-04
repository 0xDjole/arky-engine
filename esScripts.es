curl -X DELETE "localhost:9200/categories?pretty"
curl -X DELETE "localhost:9200/users?pretty"
curl -X DELETE "localhost:9200/posts?pretty"

curl -XPUT "localhost:9200/categories" -H 'Content-Type: application/json'
curl -XPUT "localhost:9200/users" -H 'Content-Type: application/json'
curl -XPUT "localhost:9200/posts" -H 'Content-Type: application/json' -d '{          
  "mappings": {
    "properties": {
      "location": {
        "type": "geo_point"
      }
    }
  }
}'
















GET /_cat/indices


GET posts/_search?size=1000
{
  "query": {
    "match_all": {}
  }
}

DELETE /posts/_doc/POST%23vitae-2021-03-01t15%3A16%3A20.183z%2348%2344


GET categories/_search
{
  "query": {
    "match_all": {}
  }
}

DELETE categories/_doc/CATEGORY%23illum-2021-02-27t15%3A50%3A47.970z

GET /_cluster/health

GET /posts

GET _search
{
  "query": {
    "match_all": {}
  }
}

POST /posts/_delete_by_query
{
  "query": {
    "match_all": {}
  }
}

POST /categories/_delete_by_query
{
  "query": {
    "match_all": {}
  }
}

DELETE /posts

PUT posts
{
  "mappings": {
    "properties": {
      "location": {
        "type": "geo_point"
      }
    }
  }
}

curl -X PUT "localhost:9200/posts" -H 'Content-Type: application/json' -d '{          
  "mappings": {
    "properties": {
      "location": {
        "type": "geo_point"
      }
    }
  }
}'


PUT categories




GET /posts/_search
{
   "size": "1",
   "query": {
     "function_score": {
       "query": {
          "bool": {
           "filter": [{
             "terms_set": {
                "minimum_should_match_script": {
                            "source": 1
                        },
               "categories": {
                 "terms": ["cafe"]
               }
             }
           }]
          }
       }
     
   }
   }
 }
 
 
POST posts/_delete_by_query
{
  "query": {
    "wildcard": {
      "id": {
        "value": "*2021*",
        "boost": 1.0,
        "rewrite": "constant_score"
      }
    }
  }
}

      
POST categories/_delete_by_query
{
  "query": {
    "wildcard": {
      "id": {
        "value": "*2021*",
        "boost": 1.0,
        "rewrite": "constant_score"
      }
    }
  }
}

      
            
            
