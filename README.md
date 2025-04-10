# TODO-APP

A simple and intuitive TODO list application built with Angular for the frontend, Node.js and Express for the backend, and MongoDB as the database. This app allows users to add, edit, and delete tasks, keeping track of their to-do items efficiently.


## Project Setup -- If you want to run TODO-APP locally

1. Install [Node.js](https://nodejs.org) - version used v22.14.0
2. Install MongoDB (locally like MongoDB Compass or a cloud-based instance like MongoDB Atlas)
3. Clone the TODO-APP git repository `https://github.com/tejapathakoti/TODO.git`
4. Setting up Backend: 
    1. Navigate to cd todo-app/backend and run => `npm install`
    2. Build backend server using => `npm run build`
    3. Start the backend => `npx esr src/app.ts`
5. Setup Frontend:
    1. Navigate to cd todo-app/frontend and run => `npm install`
    2. Run => `ng serve --open`
6. The app will open in your browser at `http://localhost:4200`. 
7. You should be able to see the TODO list app where you can start creating lists and adding tasks. 
8. To run tests in frontend => `npm test` and for backend => `npm run test .`

## API DOCUMENTATION

- Base URL: http://localhost:3000

# The backend exposes the following endpoints:

# 1. GET /lists
Fetches all the lists in the Todo application.

URL: /lists
Method: GET
Request Parameters: None
Response:
    Status Code: 200 OK
    Body:
    [
        {
            "_id": "1",
            "title": "Sample List"
        },
        {
            "_id": "2",
            "title": "Another List"
        }
    ]
Error Response:
    Status Code: 500 Internal Server Error
    Body: { "error": "Failed to fetch lists" }

# 2. GET /lists/:id
Fetches a single list by its ID.

URL: /lists/:id
Method: GET
Request Parameters:
id: The ID of the list (path parameter).
Response:
    Status Code: 200 OK
    Body: 
        {
        "_id": "1",
        "title": "Sample List"
        }
Error Response:
    Status Code: 500 Internal Server Error
    Body: { "error": "Failed to fetch lists" }

# 3. GET /lists/:listId/tasks
Fetches all tasks associated with a specific list.

URL: /lists/:listId/tasks
Method: GET
Request Parameters:
listId: The ID of the list (path parameter).
Response:
    Status Code: 200 OK
    Body:
        [
    {
        "_id": "1",
        "title": "Test Task",
        "_listId": "1"
    },
    {
        "_id": "2",
        "title": "Another Task",
        "_listId": "1"
    }
    ]
Error Response:
    Status Code: 500 Internal Server Error
    Body: { "error": "Failed to fetch tasks" }

# 4. POST /lists
Creates a new list.

URL: /lists
Method: POST
Request Body:
    {
    "title": "New Todo List"
    }
Response:
    Status Code: 200 OK
    Body:
    {
    "_id": "3",
    "title": "New Todo List"
    }
Error Response:
    Status Code: 500 Internal Server Error
    Body: { "error": "Failed to save list" }

# 5. PUT /lists/:id
Updates the title of an existing list by its ID.

URL: /lists/:id
Method: PUT
Request Parameters:
id: The ID of the list to be updated (path parameter).
Request Body:
    {
    "title": "Updated Todo List"
    }
Response:
    Status Code: 200 OK
    Body:
    { "message": "List Updated Successfully" }
Error Response:
    Status Code: 500 Internal Server Error
    Body:
    {
    "error": "Failed to update list"
    }

# 6. DELETE /lists/:id
Deletes a list by its ID.

URL: /lists/:id
Method: DELETE
Request Parameters:
id: The ID of the list to be deleted (path parameter).
Response:
    Status Code: 200 OK
    Body:
    {
    "_id": "1",
    "title": "Test List"
    }
Error Response:
    Status Code: 500 Internal Server Error
    Body:
    {
    "error": "Failed to delete list"
    }