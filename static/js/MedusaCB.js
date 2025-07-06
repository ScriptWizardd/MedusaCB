function showError(message) {
    const terminal = document.getElementById('terminal');
    const output = document.createElement('div');
    output.textContent = `[Error] ${message}`;
    output.classList.add('error');
    terminal.appendChild(output);
    terminal.scrollTop = terminal.scrollHeight;
}

if (typeof Blockly === 'undefined') {
    showError('Blockly library failed to load');
} else {
    document.addEventListener('DOMContentLoaded', () => {
        let editor;

        class ObscurusPyEditor {
            constructor() {
                this.currentFile = 'main.blocks';
                this.files = { 'main.blocks': '' };
                this.workspace = null;
                this.init();
            }

            init() {
                console.log('Initializing ObscurusPyEditor, waiting for blocks...');
                setTimeout(() => {
                    this.defineCustomBlocks();
                    const darkTheme = Blockly.Theme.defineTheme('dark', {
                        'base': Blockly.Themes.Classic,
                        'componentStyles': {
                            'workspaceBackgroundColour': '#2A0033',
                            'flyoutBackgroundColour': '#000000',
                            'toolboxBackgroundColour': '#4B0082',
                            'scrollbarColour': '#ff6666',
                            'scrollbarBackgroundColour': '#000000',
                            'insertionMarkerColour': '#ff6666',
                            'insertionMarkerOpacity': 0.3,
                            'markerColour': '#ff6666',
                            'cursorColour': '#ff6666'
                        },
                        'blockStyles': {
                            'variable_style': { 'colourPrimary': '#FF9999' },
                            'control_style': { 'colourPrimary': '#FF4040' },
                            'function_style': { 'colourPrimary': '#800080' },
                            'list_style': { 'colourPrimary': '#FF69B4' },
                            'string_style': { 'colourPrimary': '#FFA500' },
                            'dict_style': { 'colourPrimary': '#4B0082' },
                            'numeric_style': { 'colourPrimary': '#008080' },
                            'boolean_style': { 'colourPrimary': '#C71585' },
                            'tuple_style': { 'colourPrimary': '#FF7F50' },
                            'set_style': { 'colourPrimary': '#9400D3' },
                            'loop_style': { 'colourPrimary': '#DC143C' },
                            'exception_style': { 'colourPrimary': '#9932CC' },
                            'class_style': { 'colourPrimary': '#20B2AA' },
                            'module_style': { 'colourPrimary': '#FF4500' },
                            'file_style': { 'colourPrimary': '#6A5ACD' },
                            'conversion_style': { 'colourPrimary': '#00CED1' },
                            'structure_style': { 'colourPrimary': '#FFD700' }
                        },
                        'categoryStyles': {
                            'Variables': { 'colour': '#FF9999' },
                            'Control': { 'colour': '#FF4040' },
                            'Functions': { 'colour': '#800080' },
                            'Lists': { 'colour': '#FF69B4' },
                            'Strings': { 'colour': '#FFA500' },
                            'Dictionaries': { 'colour': '#4B0082' },
                            'Numeric': { 'colour': '#008080' },
                            'Boolean': { 'colour': '#C71585' },
                            'Tuples': { 'colour': '#FF7F50' },
                            'Sets': { 'colour': '#9400D3' },
                            'Loops': { 'colour': '#DC143C' },
                            'Exceptions': { 'colour': '#9932CC' },
                            'Classes': { 'colour': '#20B2AA' },
                            'Modules': { 'colour': '#FF4500' },
                            'Files': { 'colour': '#6A5ACD' },
                            'Conversions': { 'colour': '#00CED1' },
                            'Structure': { 'colour': '#FFD700' }
                        }
                    });
                    try {
                        this.workspace = Blockly.inject('blocklyDiv', {
                            toolbox: this.getToolbox(),
                            theme: darkTheme,
                            grid: {
                                spacing: 20,
                                length: 0,
                                colour: '#2A0033',
                                snap: true
                            },
                            zoom: {
                                controls: true,
                                wheel: true,
                                startScale: 1.0,
                                maxScale: 3,
                                minScale: 0.3,
                                scaleSpeed: 1.2
                            },
                            trashcan: true,
                            renderer: 'zelos',
                            toolboxPosition: 'start'
                        });
                        // Initialize with a default variable
                        if (this.workspace.getVariableMap().getAllVariables().length === 0) {
                            this.workspace.createVariable('item');
                            console.log('Initialized default variable: item');
                        }
                        // Test a minimal block sequence to ensure connectivity
                        const testBlock = this.workspace.newBlock('start_medusa_code');
                        const varBlock = this.workspace.newBlock('variable_set');
                        varBlock.setFieldValue('item', 'VAR');
                        const numBlock = this.workspace.newBlock('number_value');
                        numBlock.setFieldValue('5', 'VALUE');
                        varBlock.getInput('VALUE').connection.connect(numBlock.outputConnection);
                        testBlock.nextConnection.connect(varBlock.previousConnection);
                        const endBlock = this.workspace.newBlock('end_medusa_code');
                        varBlock.nextConnection.connect(endBlock.previousConnection);
                        console.log('Test block sequence created, rendering...');
                        this.workspace.render();
                        // Clean up test blocks
                        testBlock.dispose(true);
                        varBlock.dispose(true);
                        numBlock.dispose(true);
                        endBlock.dispose(true);
                        console.log('Workspace initialized with blocks:', this.workspace.getAllBlocks().map(b => ({ type: b.type, id: b.id })));
                        Blockly.svgResize(this.workspace);
                    } catch (e) {
                        showError(`Failed to initialize Blockly: ${e.message}`);
                    }
                    this.bindEvents();
                    this.setupResizableAreas();
                    this.updateStatusBar();
                    editor = this;
                    this.loadWorkspace(this.currentFile);
                    this.workspace.getToolbox().selectItemByPosition(0);
                }, 100);
            }

            defineCustomBlocks() {
                console.log('Custom blocks defined (via codeblocks.js)');
            }

            getToolbox() {
                return `
                    <xml id="toolbox" style="display: none;">
                        <category name="Structure" colour="#FFD700">
                            <block type="start_medusa_code"></block>
                            <block type="end_medusa_code"></block>
                        </category>
                        <category name="Variables" colour="#FF9999">
                            <block type="variable_set"></block>
                            <block type="variable_get"></block>
                            <button text="Create Variable" callbackKey="createVariable"></button>
                        </category>
                        <category name="Control" colour="#FF4040">
                            <block type="if_statement"></block>
                            <block type="if_else_statement"></block>
                        </category>
                        <category name="Functions" colour="#800080">
                            <block type="function_define"></block>
                            <block type="function_call"></block>
                            <block type="function_return"></block>
                        </category>
                        <category name="Lists" colour="#FF69B4">
                            <block type="list_create"></block>
                            <block type="list_append"></block>
                            <block type="list_get"></block>
                            <block type="list_set"></block>
                            <block type="list_length"></block>
                            <block type="list_slice"></block>
                        </category>
                        <category name="Strings" colour="#FFA500">
                            <block type="string_value"></block>
                            <block type="string_concat"></block>
                            <block type="string_length"></block>
                            <block type="string_substring"></block>
                            <block type="print_statement"></block>
                        </category>
                        <category name="Dictionaries" colour="#4B0082">
                            <block type="dict_create"></block>
                            <block type="dict_get"></block>
                            <block type="dict_set"></block>
                            <block type="dict_keys"></block>
                            <block type="dict_values"></block>
                        </category>
                        <category name="Numeric" colour="#008080">
                            <block type="math_number_open"></block>
                            <block type="number_value"></block>
                            <block type="math_operation"></block>
                            <block type="math_compare"></block>
                        </category>
                        <category name="Boolean" colour="#C71585">
                            <block type="boolean_value"></block>
                            <block type="logic_compare"></block>
                            <block type="logic_operation"></block>
                            <block type="logic_not"></block>
                        </category>
                        <category name="Tuples" colour="#FF7F50">
                            <block type="tuple_create"></block>
                            <block type="tuple_get"></block>
                        </category>
                        <category name="Sets" colour="#9400D3">
                            <block type="set_create"></block>
                            <block type="set_add"></block>
                            <block type="set_remove"></block>
                            <block type="set_union"></block>
                            <block type="set_intersection"></block>
                        </category>
                        <category name="Loops" colour="#DC143C">
                            <block type="while_loop"></block>
                            <block type="for_loop"></block>
                            <block type="break_statement"></block>
                            <block type="continue_statement"></block>
                        </category>
                        <category name="Exceptions" colour="#9932CC">
                            <block type="try_catch"></block>
                            <block type="raise_exception"></block>
                        </category>
                        <category name="Classes" colour="#20B2AA">
                            <block type="class_define"></block>
                            <block type="class_instance"></block>
                            <block type="class_method"></block>
                        </category>
                        <category name="Modules" colour="#FF4500">
                            <block type="import_module"></block>
                            <block type="module_function"></block>
                        </category>
                        <category name="Files" colour="#6A5ACD">
                            <block type="file_open"></block>
                            <block type="file_read"></block>
                            <block type="file_write"></block>
                        </category>
                        <category name="Conversions" colour="#00CED1">
                            <block type="to_string"></block>
                            <block type="to_number"></block>
                            <block type="to_boolean"></block>
                        </category>
                    </xml>
                `;
            }

            bindEvents() {
                document.getElementById('categoryMenu').addEventListener('click', (e) => {
                    const li = e.target.closest('li');
                    if (li && li.dataset.category) {
                        this.switchCategory(li.dataset.category);
                    }
                });

                this.workspace.addChangeListener(() => {
                    this.files[this.currentFile] = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(this.workspace));
                    this.updateStatusBar();
                    console.log('Workspace changed, blocks:', this.workspace.getAllBlocks().map(b => ({
                        type: b.type,
                        id: b.id,
                        inputs: b.inputList.map(i => ({
                            name: i.name,
                            connection: i.connection ? i.connection.targetBlock() ? i.connection.targetBlock().type : 'none' : 'none'
                        }))
                    })));
                });

                document.getElementById('terminalInput').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.executeCommand(e.target.value);
                        e.target.value = '';
                    }
                });

                document.getElementById('pipInput').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        const command = e.target.value.trim();
                        if (command.startsWith('pip install')) {
                            this.executePipCommand(command);
                            e.target.value = '';
                        } else {
                            showError('Invalid pip command. Use "pip install <package>"');
                        }
                    }
                });

                const sidebar = document.getElementById('sidebar');
                new ResizeObserver(() => this.adjustSidebarButtons()).observe(sidebar);

                const convertButton = document.getElementById('convertButton');
                const downloadButton = document.getElementById('downloadButton');
                const testButton = document.getElementById('testButton');
                const closePopupButton = document.getElementById('closePopupButton');

                if (!convertButton || !downloadButton || !testButton || !closePopupButton) {
                    showError('Button elements not found in DOM');
                    return;
                }

                convertButton.addEventListener('click', () => {
                    console.log('Convert button clicked');
                    this.convertCode();
                });

                downloadButton.addEventListener('click', () => {
                    console.log('Download button clicked');
                    this.downloadCode();
                });

                testButton.addEventListener('click', () => {
                    this.testBackend();
                });

                closePopupButton.addEventListener('click', () => {
                    this.closePopup();
                });

                this.workspace.registerButtonCallback('createVariable', (button) => {
                    Blockly.Variables.createVariableButtonHandler(this.workspace, null, '');
                    console.log('Create Variable button clicked, new variables:', this.workspace.getVariableMap().getAllVariables());
                });
            }

            adjustSidebarButtons() {
                const sidebar = document.getElementById('sidebar');
                const sidebarWidth = sidebar.offsetWidth;
                const items = document.querySelectorAll('.category-menu li');
                let fontSize = 13;

                if (sidebarWidth < 200) {
                    fontSize = 11;
                } else if (sidebarWidth < 250) {
                    fontSize = 12;
                }

                items.forEach(item => {
                    item.style.fontSize = `${fontSize}px`;
                });
            }

            setupResizableAreas() {
                interact('#resizer').draggable({
                    listeners: {
                        move(event) {
                            const sidebar = document.getElementById('sidebar');
                            const editorContainer = document.getElementById('editorContainer');
                            const resizer = document.getElementById('resizer');
                            const newWidth = Math.max(150, Math.min(400, sidebar.offsetWidth + event.dx));
                            sidebar.style.width = `${newWidth}px`;
                            resizer.style.left = `${newWidth}px`;
                            editorContainer.style.marginLeft = `${newWidth + 5}px`;
                            editor.adjustSidebarButtons();
                            Blockly.svgResize(editor.workspace);
                        }
                    }
                });

                interact('#editorResizer').resizable({
                    edges: { top: true, bottom: false, left: false, right: false },
                    listeners: {
                        move(event) {
                            const editorWrapper = document.getElementById('editorWrapper');
                            const terminal = document.getElementById('terminal');
                            const newHeight = Math.max(200, Math.min(600, editorWrapper.offsetHeight + event.dy));
                            editorWrapper.style.height = `${newHeight}px`;
                            terminal.style.height = `calc(100% - ${newHeight}px - 5px)`;
                            Blockly.svgResize(editor.workspace);
                        }
                    }
                });

                interact('.terminal').resizable({
                    edges: { top: true, bottom: false, left: false, right: false },
                    listeners: {
                        move(event) {
                            const target = event.target;
                            const editorWrapper = document.getElementById('editorWrapper');
                            const newHeight = Math.max(100, Math.min(400, event.rect.height));
                            target.style.height = `${newHeight}px`;
                            editorWrapper.style.height = `calc(100% - ${newHeight}px - 5px)`;
                            Blockly.svgResize(editor.workspace);
                        }
                    }
                });
            }

            switchCategory(category) {
                document.querySelectorAll('.category-menu li').forEach(item => {
                    item.classList.toggle('active', item.dataset.category === category);
                });

                const categories = ['Structure', 'Variables', 'Control', 'Functions', 'Lists', 'Strings', 'Dictionaries', 'Numeric', 'Boolean', 'Tuples', 'Sets', 'Loops', 'Exceptions', 'Classes', 'Modules', 'Files', 'Conversions'];
                const index = categories.indexOf(category);
                const toolbox = this.workspace.getToolbox();
                if (toolbox && index >= 0) {
                    toolbox.selectItemByPosition(index);
                    document.querySelectorAll('.blocklyTreeRow').forEach((row, i) => {
                        row.setAttribute('category', categories[i]);
                    });
                }
            }

            updateStatusBar() {
                const blockCount = this.workspace.getAllBlocks().length;
                const variableCount = this.workspace.getVariableMap().getAllVariables().length;
                document.getElementById('blockCount').textContent = `${blockCount} Blocks, ${variableCount} Variables`;
            }

            generateCode() {
                if (!this.workspace) {
                    console.error('Workspace not initialized');
                    return '';
                }
                const blocks = this.workspace.getAllBlocks();
                console.log('All blocks in workspace:', blocks.map(b => ({
                    type: b.type,
                    id: b.id,
                    inputs: b.inputList.map(i => ({
                        name: i.name,
                        connection: i.connection ? i.connection.targetBlock() ? i.connection.targetBlock().type : 'none' : 'none',
                        connected: !!i.connection?.targetConnection
                    })),
                    next: b.nextConnection ? b.nextConnection.targetBlock() ? b.nextConnection.targetBlock().type : 'none' : 'none'
                })));

                let code = Blockly.Python.workspaceToCode(this.workspace);
                console.log('Generated Code from workspaceToCode:', code);

                // Manual block traversal with sequence validation
                if (!code.trim()) {
                    console.warn('workspaceToCode returned empty, attempting manual generation');
                    code = '';
                    let currentBlock = blocks.find(b => b.type === 'start_medusa_code');
                    while (currentBlock) {
                        console.log(`Processing block ${currentBlock.type} (id: ${currentBlock.id})`);
                        if (currentBlock.type === 'start_medusa_code') {
                            code += '';
                        } else if (currentBlock.type === 'end_medusa_code') {
                            code += '\n';
                        } else if (currentBlock.type === 'variable_set') {
                            const variable = Blockly.Python.getVariableName(currentBlock.getFieldValue('VAR'));
                            const valueInput = currentBlock.getInput('VALUE');
                            let value = '0'; // Default value
                            if (valueInput?.connection?.targetConnection) {
                                value = Blockly.Python.valueToCode(currentBlock, 'VALUE', Blockly.Python.ORDER_ASSIGNMENT) || '0';
                                console.log(`Generated value for ${variable}: ${value}`);
                            } else {
                                console.warn(`No connection for ${variable} in block ${currentBlock.id}, using default 0`);
                            }
                            code += `${variable} = ${value}\n`;
                        }
                        currentBlock = currentBlock.nextConnection?.targetBlock();
                    }
                }

                console.log('Final Generated Code:', code);
                return code || '';
            }

            loadWorkspace() {
                this.workspace.clear();
                if (this.files[this.currentFile]) {
                    try {
                        const xml = Blockly.Xml.textToDom(this.files[this.currentFile]);
                        Blockly.Xml.domToWorkspace(xml, this.workspace);
                        console.log('Workspace loaded with XML:', this.files[this.currentFile]);
                    } catch (e) {
                        showError(`Error loading workspace: ${e.message}`);
                    }
                }
            }

            async convertCode() {
                const code = this.generateCode();
                console.log('Code before conversion attempt:', code);
                if (!code.trim()) {
                    showError('No blocks to convert');
                    console.log('Empty code detected, workspace blocks:', this.workspace.getAllBlocks().map(b => ({
                        type: b.type,
                        id: b.id,
                        inputs: b.inputList.map(i => i.name)
                    })));
                    return;
                }
                this.files[this.currentFile] = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(this.workspace));
                try {
                    const response = await fetch('http://localhost:5672/convert', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code })
                    });
                    const result = await response.json();
                    console.log('Convert Response:', result);
                    const terminal = document.getElementById('terminal');
                    const output = document.createElement('div');
                    if (response.ok) {
                        if (result.error) {
                            output.textContent = `> Code conversion failed: ${result.error}`;
                        } else {
                            output.textContent = `> ${result.message}`;
                            if (result.output) {
                                const outputLines = result.output.split('\n').filter(line => line.trim());
                                outputLines.forEach(line => {
                                    const outputDiv = document.createElement('div');
                                    outputDiv.textContent = `> ${line}`;
                                    terminal.appendChild(outputDiv);
                                });
                            }
                            document.getElementById('popupMessage').textContent = result.message;
                            document.getElementById('conversionPopup').style.display = 'block';
                        }
                    } else {
                        output.textContent = `> Code conversion failed: ${result.error || 'Unknown error'}`;
                        output.classList.add('error');
                    }
                    terminal.appendChild(output);
                    terminal.scrollTop = terminal.scrollHeight;
                } catch (e) {
                    console.error('Convert Error:', e);
                    showError(`Failed to connect to server: ${e.message}`);
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', 'http://localhost:5672/convert', true);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                const result = JSON.parse(xhr.responseText);
                                console.log('XHR Convert Response:', result);
                                const terminal = document.getElementById('terminal');
                                const output = document.createElement('div');
                                if (result.error) {
                                    output.textContent = `> Code conversion failed: ${result.error}`;
                                } else {
                                    output.textContent = `> ${result.message}`;
                                    if (result.output) {
                                        const outputLines = result.output.split('\n').filter(line => line.trim());
                                        outputLines.forEach(line => {
                                            const outputDiv = document.createElement('div');
                                            outputDiv.textContent = `> ${line}`;
                                            terminal.appendChild(outputDiv);
                                        });
                                    }
                                    document.getElementById('popupMessage').textContent = result.message;
                                    document.getElementById('conversionPopup').style.display = 'block';
                                }
                                terminal.appendChild(output);
                                terminal.scrollTop = terminal.scrollHeight;
                            } else {
                                const result = JSON.parse(xhr.responseText);
                                console.error('XHR Convert Error:', result);
                                showError(`XHR error: ${result.error || 'Unknown error'}`);
                            }
                        }
                    };
                    xhr.send(JSON.stringify({ code }));
                }
            }

            async downloadCode() {
                const code = this.generateCode();
                console.log('Generated Code for Download:', code);
                if (!code.trim()) {
                    showError('No code to download');
                    console.log('Empty code detected, workspace blocks:', this.workspace.getAllBlocks().map(b => ({
                        type: b.type,
                        id: b.id,
                        inputs: b.inputList.map(i => i.name)
                    })));
                    return;
                }
                this.files[this.currentFile] = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(this.workspace));
                try {
                    const response = await fetch('http://localhost:5672/download', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code })
                    });
                    const result = await response.json();
                    console.log('Download Response:', result);
                    const terminal = document.getElementById('terminal');
                    const output = document.createElement('div');
                    if (response.ok) {
                        if (result.error) {
                            output.textContent = `> Download failed: ${result.error}`;
                        } else {
                            const blob = await fetch(result.download_url).then(res => res.blob()).catch(err => {
                                throw new Error('Failed to fetch blob');
                            });
                            const filename = result.filename || 'program.py';
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = filename;
                            a.click();
                            window.URL.revokeObjectURL(url);
                            output.textContent = `> Downloaded ${filename} to /MedusaCB/GeneratedCodes`;
                        }
                    } else {
                        output.textContent = `> Download failed: ${result.error || 'Unknown error'}`;
                        output.classList.add('error');
                    }
                    terminal.appendChild(output);
                    terminal.scrollTop = terminal.scrollHeight;
                } catch (e) {
                    console.error('Download Error:', e);
                    showError(`Failed to download: ${e.message}`);
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', 'http://localhost:5672/download', true);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === 4) {
                            if (xhr.status === 200) {
                                const result = JSON.parse(xhr.responseText);
                                console.log('XHR Download Response:', result);
                                const terminal = document.getElementById('terminal');
                                const output = document.createElement('div');
                                if (result.error) {
                                    output.textContent = `> Downloaded with errors: ${result.error}`;
                                } else {
                                    fetch(result.download_url).then(res => res.blob()).then(blob => {
                                        const filename = result.filename || 'program.py';
                                        const url = window.URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = filename;
                                        a.click();
                                        window.URL.revokeObjectURL(url);
                                        output.textContent = `> Downloaded ${filename} to /MedusaCB/GeneratedCodes`;
                                        terminal.appendChild(output);
                                        terminal.scrollTop = terminal.scrollHeight;
                                    }).catch(err => {
                                        showError('Failed to fetch download file');
                                    });
                                }
                                terminal.appendChild(output);
                                terminal.scrollTop = terminal.scrollHeight;
                            } else {
                                const result = JSON.parse(xhr.responseText);
                                console.error('XHR Download Error:', result);
                                showError(`XHR error: ${result.error || 'Unknown error'}`);
                            }
                        }
                    };
                    xhr.send(JSON.stringify({ code }));
                }
            }

            async testBackend() {
                try {
                    const response = await fetch('http://localhost:5672/test', {
                        method: 'GET'
                    });
                    const result = await response.json();
                    const terminal = document.getElementById('terminal');
                    const output = document.createElement('div');
                    output.textContent = `> ${result.message}`;
                    terminal.appendChild(output);
                    terminal.scrollTop = terminal.scrollHeight;
                } catch (e) {
                    showError(`Failed to connect to backend: ${e.message}`);
                }
            }

            executeCommand(command) {
                const terminal = document.getElementById('terminal');
                const output = document.createElement('div');
                output.textContent = `> ${command}`;
                terminal.appendChild(output);

                if (command === 'clear') {
                    terminal.innerHTML = '<input type="text" class="terminal-input" id="terminalInput" placeholder="Enter command...">';
                    document.getElementById('terminalInput').addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            this.executeCommand(e.target.value);
                            e.target.value = '';
                        }
                    });
                }
                terminal.scrollTop = terminal.scrollHeight;
            }

            executePipCommand(command) {
                const terminal = document.getElementById('terminal');
                const output = document.createElement('div');
                output.textContent = `> Processing pip command: ${command}`;
                terminal.appendChild(output);
                terminal.scrollTop = terminal.scrollHeight;

                fetch('http://localhost:5672/install', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ command })
                })
                    .then(response => response.json())
                    .then(result => {
                        const terminal = document.getElementById('terminal');
                        const output = document.createElement('div');
                        if (result.error) {
                            output.textContent = `> Pip install failed: ${result.error}`;
                            output.classList.add('error');
                        } else {
                            output.textContent = `> ${result.message}`;
                        }
                        terminal.appendChild(output);
                        terminal.scrollTop = terminal.scrollHeight;
                    })
                    .catch(e => {
                        showError(`Failed to execute pip command: ${e.message}`);
                    });
            }

            closePopup() {
                document.getElementById('conversionPopup').style.display = 'none';
            }
        }

        editor = new ObscurusPyEditor();
    });
}