# Home Library Service

## Downloading and installing

```
git clone --branch dev --single-branch https://github.com/husanGuru/nodejs2025Q2-service.git .

npm install
```

## Running application

```
npm start
```

The app starts on port 4000 by default (http://localhost:4000), can be modified in .env




## API Reference

#### Users (/user)

get all users
```http
  GET /user
```
get user by id
```http
  GET /user/:id
```
create new user
```http
  POST /user
```
| Body      | Type     | Description  |
| :-------- | :------- | :------------|
| `login`   | `string` | **Required** |
| `password`| `string` | **Required** |

update user
```http
  PUT /user/:id
```
| Parameter | Type     | Description  |
| :-------- | :------- | :------------|
| `id`      | `string` | **Required** |

| Body         | Type     | Description  |
| :------------| :------- | :------------|
| `oldPassword`| `string` | **Required** |
| `newPassword`| `string` | **Required** |

---
#### Tracks (/track)

get all tracks
```http
  GET /track
```
get track by id
```http
  GET /track/:id
```
create new track
```http
  POST /track
```
| Body      | Type             | Description  |
| :-------- | :--------------- | :------------|
| `name`    | `string`         | **Required** |
| `duration`| `number`         | **Required** |
| `artistId`| `UUID4 \| null`  | Optional     |
| `albumId` | `UUID4 \| null`  | Optional     |

update track
```http
  PUT /track/:id
```
| Parameter | Type     | Description  |
| :-------- | :------- | :------------|
| `id`      | `string` | **Required** |

| Body      | Type             | Description |
| :---------| :--------------- | :-----------|
| `name`    | `string`         | Optional    |
| `duration`| `string`         | Optional    |
| `artistId`| `UUID4 \| null`  | Optional    |
| `albumId` | `UUID4 \| null`  | Optional    |

delete track by id
```http
  DELETE /track/:id
```
---
#### Artists (/artist)

get all artists
```http
  GET /artist
```
get artist by id
```http
  GET /artist/:id
```
create new artist
```http
  POST /artist
```
| Body      | Type             | Description  |
| :-------- | :--------------- | :------------|
| `name`    | `string`         | **Required** |
| `grammy`  | `string`         | **Required** |

update artist
```http
  PUT /artist/:id
```
| Parameter | Type     | Description  |
| :-------- | :------- | :------------|
| `id`      | `string` | **Required** |

| Body      | Type             | Description |
| :---------| :--------------- | :-----------|
| `name`    | `string`         | Optional    |
| `grammy`  | `string`         | Optional    |

delete artist by id
```http
  DELETE /artist/:id
```
---
#### Albums (/album)

get all albums
```http
  GET /album
```
get album by id
```http
  GET /album/:id
```
create new album
```http
  POST /album
```
| Body      | Type             | Description  |
| :-------- | :--------------- | :------------|
| `name`    | `string`         | **Required** |
| `year`    | `number`         | **Required** |
| `artistId`| `UUID4 \| null`  | Optional     |

update album
```http
  PUT /album/:id
```
| Parameter | Type     | Description  |
| :-------- | :------- | :------------|
| `id`      | `string` | **Required** |

| Body      | Type             | Description |
| :---------| :--------------- | :-----------|
| `name`    | `string`         | Optional    |
| `year`    | `string`         | Optional    |
| `artistId`| `UUID4 \| null`  | Optional    |

delete album by id
```http
  DELETE /album/:id
```
---
#### Favorites (/favs)

get all favorites
```http
  GET /favs
```
add track to favorites
```http
  POST /favs/track/:id
```
| Parameter | Type     | Description  |
| :-------- | :------- | :------------|
| `id`      | `UUID4`  | **Required**id of track |

add album to favorites
```http
  POST /favs/album/:id
```
| Parameter | Type     | Description  |
| :-------- | :------- | :------------|
| `id`      | `UUID4`  | **Required**id of album |

add artist to favorites
```http
  POST /favs/artist/:id
```
| Parameter | Type     | Description  |
| :-------- | :------- | :------------|
| `id`      | `UUID4`  | **Required**id of artist |

remove track from favorites
```http
  DELETE /favs/track/:id
```
| Parameter | Type     | Description  |
| :-------- | :------- | :------------|
| `id`      | `UUID4`  | **Required**id of track |

remove album from favorites
```http
  DELETE /favs/album/:id
```
| Parameter | Type     | Description  |
| :-------- | :------- | :------------|
| `id`      | `UUID4`  | **Required**id of album |

remove artist from favorites
```http
  DELETE /favs/artist/:id
```
| Parameter | Type     | Description  |
| :-------- | :------- | :------------|
| `id`      | `UUID4`  | **Required**id of artist |

