angular.module("justMap.config", [])
.constant("name", "51.5044")
.constant("description", "A MEAN app integrated with leaflet that allows users to add comments to a map.")
.constant("repository", "https://github.com/35percent/commonplan")
.constant("logo", "https://pbs.twimg.com/profile_images/481778845620518912/fIPiDX4c.jpeg")
.constant("keywords", ["node","express","angular","MEAN","mongodb","REST","API"])
.constant("addons", ["mongolab"])
.constant("env", {"LATITUDE":{"description":"The latitude coordinate for the centre of the map.","value":"51.05"},"LONGITUDE":{"description":"The longitude coordinate for the centre of the map.","value":"-0.09"}});
