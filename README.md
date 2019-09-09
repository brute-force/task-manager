# task-manager
Task manager API written in [express](https://github.com/expressjs/express), [Mongoose](https://github.com/Automattic/mongoose), and [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken).

## Requirements
[SendGrid](https://www.sendgrid.com/) for E-mail signup confirmation.

### User API
#### Log in
```shell
POST /users/login ({ email, password }) 
```
#### Log out
```shell
GET /users/logout
```
#### Log out all sessions
```shell
GET /users/logout/all
```
#### Get your user profile
```shell
GET /users/me
```
#### Get user by id
```shell
GET /users/:id
```
#### Create user
```shell
POST /users ({ email, name }) 
```
#### Update user
```shell
PATCH /users/me ({ name, email, password, age })
```
#### Delete your user profile
```shell
DELETE /users/me
```
#### Upload user avatar
```shell
POST /users/me/avatar [file content]
```
#### Get user avatar by id
```shell
GET /users/:id/avatar
```
&nbsp;  
&nbsp;  
### Task API
#### Get task by id
```shell
GET /tasks/:id
```
#### Create task
```shell
POST /tasks ({ owner: user_id, ...task }) 
```
#### Update task
```shell
PATCH /tasks/:id ({ description, isCompleted })
```
#### Delete task
```shell
DELETE /tasks/:id
```
