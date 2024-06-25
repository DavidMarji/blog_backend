# backend for my blog program. 
This backend uses nodejs. 
I'm also using postgresql for my database.

# packages used:
1) knex, objection, and pg to communicate with the database.
2) crypto for hashing passwords and for generating UUIDs.
3) jsonwebtoken for user authorization and authentication.
4) body-parser for receiving json's properly from requests.
5) archiver and multer for receiving, saving, and sending images in a zip file.
6) nodemon for easier and more smooth development.

# design explanation:
The project design follows a MVC pattern where the user can have many blogs but each blog belongs to one user,
each blog has many pages but each page belongs to on blog, and finally each page can have many images, but each image only belongs to one page.
