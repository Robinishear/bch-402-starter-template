📦 Express.js Essential Middleware Packages
Our project uses 4 very important global middleware to facilitate security, logging and data parsing. Below is their brief description:

1. 🛡️ Helmet
What it does: Strengthens and secures the HTTP response headers of websites.
Why it is used: It works to protect the website from all common web attacks (eg: XSS, Clickjacking, MIME-sniffing etc.) and to keep the server anonymous.
Usage in code: app.use(helmet());

2. 📊 Morgan
Job Key: HTTP Request Logger (HTTP Request Logger).
Why is it used: To display in the terminal a real-time history or log of when the client is sending requests to the server (eg: GET /api/users 200) and how the server is responding.
Usage in code: To track requests globally app.use(morgan('dev')); is given as

3. 🍪 Cookie-Parser
Function key: cookie parsing middleware.
Why it's used: Converts raw cookie strings from the user's browser into readable JavaScript objects, so that cookies can easily be read via req.cookies.
Usage in code: app.use(cookieParser());

4. 🔍 Qs (Query String)
Function Key: Query string parser.
Why is it used: For query parameters of URLs or complex nested object/array data to be perfectly parsed and converted to JavaScript objects.