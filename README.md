Medusa Code Blocks (Medusa CB):

A visual code block scripting language that converts logicflow-style codeblocks to executable Python code.

____________________________________________________________________________________________________

Medusa Code Blocks (Medusa CB) is a web-based visual programming environment designed to help Meta Horizon Worlds codeblock scripters transition to the Medusa 
visual coding language and ultimately to Python. Powered by Blockly, it offers an intuitive drag-and-drop interface for creating Medusa-inspired scripts, which 
can be converted to Python code, tested for compilation and runtime errors, and downloaded as .py files. The application is fully offline-capable, making it 
ideal for educational settings, prototyping, or environments without internet access.

Purpose:

Medusa CB is tailored for:

--Meta Horizon Worlds Scripters: Adapt codeblock scripting skills to the Medusa visual programming paradigm.
--Learning Medusa: Create and manipulate Medusa-style blocks in a familiar interface.
--Transitioning to Python: Convert Medusa blocks to Python code, enabling users to learn and apply Python programming concepts.
--Educational Use: Teach programming fundamentals to beginners using a visual, intuitive interface.

____________________________________________________________________________________________________

Directory Structure:

MedusaCB/
├── .gitignore           # Excludes monaco-editor, prism, and GeneratedCodes/*
├── MedusaCB.html        # Frontend HTML with Blockly interface
├── MedusaCB.py          # Flask backend server
├── README.md            # Project documentation
├── static/
│   ├── blockly/
│   │   ├── blockly.min.js        # Blockly core library
│   │   ├── python_compressed.js  # Python code generator
│   ├── interactjs/
│   │   ├── interact.min.js       # Resizable UI elements
└── GeneratedCodes/      # Empty directory for generated Python files

____________________________________________________________________________________________________

Dependencies:

Frontend
--Blockly: Version 10.4.3, included locally:
    static/blockly/blockly.min.js (Blockly core)
    static/blockly/python_compressed.js (Python generator)
--Interact.js: Version 1.10.27, included locally:
    static/interactjs/interact.min.js (for resizable UI elements)

Backend
--Python: 3.6 or higher
--Flask: Web framework for serving the application
--Flask-CORS: Enables Cross-Origin Resource Sharing for frontend-backend communication
--Python Standard Libraries: os, time, logging, io, sys, contextlib

____________________________________________________________________________________________________

Installation:

1. Clone the Repository:
    git clone https://github.com/ScriptWizardd/MedusaCB.git
    cd MedusaCB
    
2. Verify Directory Structure:
    Ensure the following files are present:
        MedusaCB.html
        MedusaCB.py
        static/blockly/blockly.min.js
        static/blockly/python_compressed.js
        static/interactjs/interact.min.js
    If any files are missing, download them:
        mkdir -p static/blockly static/interactjs GeneratedCodes
        wget https://unpkg.com/blockly@10.4.3/blockly.min.js -O static/blockly/blockly.min.js
        wget https://unpkg.com/blockly@10.4.3/python_compressed.js -O static/blockly/python_compressed.js
        wget https://unpkg.com/interactjs@1.10.27/dist/interact.min.js -O static/interactjs/interact.min.js
        chmod -R u+r static
        chmod -R u+w GeneratedCodes
        
3. Install Backend Dependencies:
    pip install flask flask-cors
    
4. Start the Backend:
    python3 MedusaCB.py\
____________________________________________________________________________________________________

The Flask server starts on http://localhost:5672 and opens in your default browser.

The server serves MedusaCB.html, handles code conversion, and saves files to GeneratedCodes/.

____________________________________________________________________________________________________

Using the Application:

--Create Code: Drag blocks from categories (e.g., Strings for print) to build Medusa-style scripts.
--Test Backend: Click Test Backend to verify server connectivity (terminal shows > Backend is reachable).
--Convert Code: Click Convert to test the generated Python code for errors (popup shows success or error message).
--Download Code: Click Download to save the Python code to GeneratedCodes/generated_code_<timestamp>.py.
--Close Popup: Click Close on the conversion popup to dismiss it.
--Terminal Commands: Type clear in the terminal to reset its output.

____________________________________________________________________________________________________

Testing:

Verify Interface:

--Check that the toolbox (#4B0082) and categories (Variables #FF9999, Control #FF4040, etc.) load.
--Create a "Hello World" block (Strings category, print with "Hello World").

Test Buttons:

--Test Backend: Console logs Test button clicked, terminal shows > Backend is reachable.
--Convert: Console logs convertCode called, terminal shows > Code successfully converted..., popup appears.
--Download: Console logs downloadCode called, terminal shows > Downloaded generated_code_<timestamp>.py to /MedusaCB/GeneratedCodes, file saved in GeneratedCodes/.

____________________________________________________________________________________________________

Troubleshooting:

--Blocks/Menus Not Loading: Ensure static/blockly/blockly.min.js and static/blockly/python_compressed.js are present and referenced in MedusaCB.html. Check console for errors.
--Buttons Not Working: Verify Flask server is running and check console for fetch or XMLHttpRequest errors.
--File Not Saving: Confirm write permissions for GeneratedCodes/:
    chmod -R u+w GeneratedCodes
--CORS Issues: Ensure flask-cors is installed and the backend is running on port 5672.
--Offline Issues: Verify all <script> tags in MedusaCB.html point to local files, and test without internet.

____________________________________________________________________________________________________

License:

This project is licensed under the MIT License. See the LICENSE file for details.










