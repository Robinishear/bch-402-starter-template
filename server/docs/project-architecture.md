You’ve done an excellent job organizing the architecture and file structure of your project! To help you easily grasp the overall flow while coding in the future, I’ve put together this brief documentation (in simple Bengali) based on the files you provided:


### 1. Error Helpers
 **App Error Handler**
 This file serves as the core foundation for handling custom (applicationspecific) errors.
 It is used to send specific status codes whenever logical or businesslevel issues arise during an API request.
 It acts as a centralized mechanism for delivering standard error responses throughout the codebase.
 It ensures that when an error occurs, the application doesn't crash; instead, it gracefully delivers a meaningful message to the client.
 It keeps the code clean by eliminating the need to repeatedly write out exceptionhandling logic.

 **Prisma Error Handler**
 This handler catches various technical errors that may arise from Prisma during database operations.
 It translates common database errors—such as duplicate entries or missing records—into userfriendly messages.
 It helps protect the backend server from unexpected crashes caused by database issues.
 It is highly effective for quickly identifying bugs related to database queries during the development process.
 It gracefully catches databaselevel issues and passes them along to the main application flow.

 **Zod Error**
 This handler is triggered whenever the Zod schema detects an error during request body or data validation. \* If a user submits data in an incorrect format, it precisely identifies which field contains the issue.
 It generates accurate and understandable error messages for frontend developers or clients.
 It serves as a first line of defense, ensuring input sanitization and security.
 It prevents potential damage to the database or server that could be caused by the input of invalid data.

### 2. Interface
 **Error Interface**
 Defines a specific type or structure for all error objects within the project.
 Ensures that error responses adhere to the correct format, in compliance with TypeScript’s strict rules.
 Significantly reduces the likelihood of type mismatches or bugs during development.
 Provides helpful IntelliSense or code suggestions when handling errors.
 Ensures a consistent and uniform data structure for errors throughout the entire application.

 **index.d.ts**
 Serves as a global type declaration file within the project.
 Allows for the addition of custom properties (such as user information or session data) to the Express request object.
 Essential for extending the types of thirdparty or custom modules.
 Prevents unnecessary TypeScript errors or warnings from appearing in the code editor.
 Helps organize and consolidate the project's global type definitions in one place.

 **Query Interface**
 Defines the types for query parameters used when filtering, sorting, or paginating data from a database.
 Validates that the query structure received by the API conforms to the expected, safe format.
 Guides developers on the correct properties to use when handling query requests.
 Maintains type safety when querying large datasets. \* Protects the code from the passing of unnecessary or incorrect query parameters.

 **Query User Interface**
 Defines type structures specifically for userrelated queries and filtering.
 Uses TypeScript to correctly bind user search or datafetching parameters.
 Keeps the code clean and readable when retrieving specific user data from the database.
 Prevents the entry of incorrect types into the query logic of the user module.
 Helps enhance the scalability of the entire user query system.


### 3. Middleware
 **Check Auth**
 Securely verifies whether a user's request contains a valid token or session.
 Prevents unauthorized access to protected APIs or routes.
 Upon successful authentication, attaches user information to the request object and passes it to the next controller.
 Blocks unauthorized requests or potential hacking attempts at an early stage.
 Acts as the primary guardian for ensuring route security across the entire project.

 **Global Error Handler**
 Catches unhandled errors originating from any part of the application.
 Intercepts potential application crashes and provides a graceful response to the user.
 In production mode, hides sensitive error details and returns clean, userfriendly error messages.
 Serves as the final line of defense for managing code errors centrally.
 Essential for maintaining server stability and ensuring a smooth user experience.

 **Not Found**
 Triggered when a user attempts to access an API route or link that does not exist within the project.
 Returns a standard `404 Not Found` status code along with a clear error message.
 Prevents the system from becoming unstable or confused when requests are made to nonexistent endpoints.
 Helps in easily identifying errors in routing configuration.
 Provides a professional approach to handling missing API routes.
 
 \* **Valid Request**
 Input data sent from the client is validated using a Zod schema before it reaches the controller.
 If the input data is invalid, the request is rejected before it can proceed to the controller.
 It saves server processing time and ensures that only valid data is processed.
 It prevents malicious or erroneous data from entering the backend.
 It keeps the API data flow entirely reliable and errorfree.


### 4. Utilities
* **`cookies.ts`**
* Contains helper functions for securely setting, reading, or deleting cookies in the browser.
* Manages security flags when storing sensitive data—such as authentication tokens—in cookies.
* Ensures the `HttpOnly` and `Secure` properties are set to prevent CrossSite Scripting (XSS) and cookie theft.
* Simplifies the process of clearing cookies during logout or upon session expiration.
* Makes cookie management code reusable throughout the application.


* **`jwt.ts`**
* Handles the core tasks of creating (signing) and verifying JSON Web Tokens (JWT).
* Issues a secure access token to a user upon successful login.
* Decodes tokens to identify the user when they access protected routes.
* Precisely controls the expiration date/time of tokens.
* Ensures tokens are generated while maintaining cryptographic security.


* **`token.ts`**
* Manages the generation of various other random or specialized tokens within the project.
* Facilitates the creation of unique tokens for purposes such as password resets or email verification.
* Helps keep the codebase clean by isolating tokenhandling logic.
* Generates cryptographically secure random strings.
* Streamlines and simplifies the management of tokens used for various functions.