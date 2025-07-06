// Define custom Blockly blocks and their Python generators

Blockly.Blocks['start_medusa_code'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('Start Medusa Code');
        this.setNextStatement(true);
        this.setColour('#FFD700');
        this.setTooltip('Marks the beginning of Medusa code execution.');
    }
};
Blockly.Python['start_medusa_code'] = function(block, generator) {
    return '';
};

Blockly.Blocks['end_medusa_code'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('End of Medusa Code');
        this.setPreviousStatement(true);
        this.setColour('#FFD700');
        this.setTooltip('Marks the end of Medusa code execution.');
    }
};
Blockly.Python['end_medusa_code'] = function(block, generator) {
    return '\n';
};

Blockly.Blocks['variable_set'] = {
    init: function() {
        this.appendValueInput('VALUE')
            .appendField('set')
            .appendField(new Blockly.FieldVariable('item'), 'VAR')
            .appendField('to');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#FF9999');
        this.setInputsInline(true);
        this.setTooltip('Sets a variable to a specified value.');
    }
};
Blockly.Python['variable_set'] = function(block, generator) {
    const variable = generator.getVariableName(block.getFieldValue('VAR'));
    if (!block.workspace.getVariable(variable)) {
        block.workspace.createVariable(variable);
        console.log('Variable created:', variable);
    }
    let value = generator.valueToCode(block, 'VALUE', Blockly.Python.ORDER_ASSIGNMENT) || '0';
    if (!block.getInput('VALUE').connection.targetConnection) {
        console.warn('No value block connected to', variable, '- using default 0');
    }
    return `${variable} = ${value}\n`;
};

Blockly.Blocks['variable_get'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldVariable('item'), 'VAR');
        this.setOutput(true, ['Number', 'String', 'Boolean', 'List', 'Dictionary', 'Tuple', 'Set']);
        this.setColour('#FF9999');
        this.setTooltip('Retrieves the value of a variable.');
    }
};
Blockly.Python['variable_get'] = function(block, generator) {
    const variable = generator.getVariableName(block.getFieldValue('VAR'));
    return [variable, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Blocks['if_else_statement'] = {
    init: function() {
        this.appendValueInput('CONDITION')
            .setCheck('Boolean')
            .appendField('if');
        this.appendStatementInput('DO')
            .appendField('do');
        this.appendStatementInput('ELSE')
            .appendField('else');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#FF4040');
        this.setTooltip('Executes code if a condition is true, otherwise executes else code.');
    }
};
Blockly.Python['if_else_statement'] = function(block, generator) {
    const condition = generator.valueToCode(block, 'CONDITION', Blockly.Python.ORDER_NONE) || 'False';
    const doStatements = generator.statementToCode(block, 'DO') || '    pass\n';
    const elseStatements = generator.statementToCode(block, 'ELSE') || '    pass\n';
    return `if ${condition}:\n${doStatements}else:\n${elseStatements}\n`;
};

Blockly.Blocks['function_return'] = {
    init: function() {
        this.appendValueInput('VALUE')
            .appendField('return');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#800080');
        this.setTooltip('Returns a value from a function.');
    }
};
Blockly.Python['function_return'] = function(block, generator) {
    const value = generator.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '';
    return `return ${value}\n`;
};

Blockly.Blocks['list_create'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('create list')
            .appendField(new Blockly.FieldTextInput('my_list'), 'NAME');
        this.appendValueInput('ITEMS')
            .setCheck(['Number', 'String', 'Boolean', 'List', 'Dictionary', 'Tuple', 'Set'])
            .appendField('with items');
        this.setOutput(true, 'List');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#FF69B4');
        this.setTooltip('Creates a list with specified items.');
    }
};
Blockly.Python['list_create'] = function(block, generator) {
    const name = block.getFieldValue('NAME');
    const items = generator.valueToCode(block, 'ITEMS', Blockly.Python.ORDER_NONE) || '';
    return `${name} = [${items}]\n`;
};

Blockly.Blocks['list_append'] = {
    init: function() {
        this.appendValueInput('ITEM')
            .appendField('append to list')
            .appendField(new Blockly.FieldTextInput('my_list'), 'NAME');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#FF69B4');
        this.setTooltip('Appends an item to the end of a list.');
    }
};
Blockly.Python['list_append'] = function(block, generator) {
    const name = block.getFieldValue('NAME');
    const item = generator.valueToCode(block, 'ITEM', Blockly.Python.ORDER_NONE) || 'None';
    return `${name}.append(${item})\n`;
};

Blockly.Blocks['list_get'] = {
    init: function() {
        this.appendValueInput('INDEX')
            .setCheck('Number')
            .appendField('get item from list')
            .appendField(new Blockly.FieldTextInput('my_list'), 'NAME')
            .appendField('at index');
        this.setOutput(true, ['Number', 'String', 'Boolean', 'List', 'Dictionary', 'Tuple', 'Set']);
        this.setColour('#FF69B4');
        this.setTooltip('Retrieves an item from a list at a specified index.');
    }
};
Blockly.Python['list_get'] = function(block, generator) {
    const name = block.getFieldValue('NAME');
    const index = generator.valueToCode(block, 'INDEX', Blockly.Python.ORDER_NONE) || '0';
    return [`${name}[${index}]`, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Blocks['list_set'] = {
    init: function() {
        this.appendValueInput('INDEX')
            .setCheck('Number')
            .appendField('set item in list')
            .appendField(new Blockly.FieldTextInput('my_list'), 'NAME')
            .appendField('at index');
        this.appendValueInput('VALUE')
            .appendField('to');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#FF69B4');
        this.setTooltip('Sets an item in a list at a specified index.');
    }
};
Blockly.Python['list_set'] = function(block, generator) {
    const name = block.getFieldValue('NAME');
    const index = generator.valueToCode(block, 'INDEX', Blockly.Python.ORDER_NONE) || '0';
    const value = generator.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || 'None';
    return `${name}[${index}] = ${value}\n`;
};

Blockly.Blocks['list_length'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('length of list')
            .appendField(new Blockly.FieldTextInput('my_list'), 'NAME');
        this.setOutput(true, 'Number');
        this.setColour('#FF69B4');
        this.setTooltip('Returns the length of a list.');
    }
};
Blockly.Python['list_length'] = function(block, generator) {
    const name = block.getFieldValue('NAME');
    return [`len(${name})`, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Blocks['list_slice'] = {
    init: function() {
        this.appendValueInput('START')
            .setCheck('Number')
            .appendField('slice list')
            .appendField(new Blockly.FieldTextInput('my_list'), 'NAME')
            .appendField('from');
        this.appendValueInput('END')
            .setCheck('Number')
            .appendField('to');
        this.setOutput(true, 'List');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#FF69B4');
        this.setTooltip('Extracts a slice of a list from start to end index.');
    }
};
Blockly.Python['list_slice'] = function(block, generator) {
    const name = block.getFieldValue('NAME');
    const start = generator.valueToCode(block, 'START', Blockly.Python.ORDER_NONE) || '0';
    const end = generator.valueToCode(block, 'END', Blockly.Python.ORDER_NONE) || '0';
    return [`${name}[${start}:${end}]`, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Blocks['string_value'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('"')
            .appendField(new Blockly.FieldTextInput('text'), 'VALUE')
            .appendField('"');
        this.setOutput(true, 'String');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#FFA500');
        this.setTooltip('Creates a string with the specified text.');
    }
};
Blockly.Python['string_value'] = function(block, generator) {
    const value = generator.quote_(block.getFieldValue('VALUE'));
    return [value, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Blocks['string_concat'] = {
    init: function() {
        this.appendValueInput('A')
            .setCheck('String')
            .appendField('concatenate');
        this.appendValueInput('B')
            .setCheck('String')
            .appendField('with');
        this.setOutput(true, 'String');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#FFA500');
        this.setTooltip('Concatenates two strings together.');
    }
};
Blockly.Python['string_concat'] = function(block, generator) {
    const a = generator.valueToCode(block, 'A', Blockly.Python.ORDER_ADDITIVE) || '""';
    const b = generator.valueToCode(block, 'B', Blockly.Python.ORDER_ADDITIVE) || '""';
    return [a + ' + ' + b, Blockly.Python.ORDER_ADDITIVE];
};

Blockly.Blocks['string_length'] = {
    init: function() {
        this.appendValueInput('STRING')
            .setCheck('String')
            .appendField('length of');
        this.setOutput(true, 'Number');
        this.setColour('#FFA500');
        this.setTooltip('Returns the length of a string.');
    }
};
Blockly.Python['string_length'] = function(block, generator) {
    const string = generator.valueToCode(block, 'STRING', Blockly.Python.ORDER_NONE) || '""';
    return [`len(${string})`, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Blocks['string_substring'] = {
    init: function() {
        this.appendValueInput('STRING')
            .setCheck('String')
            .appendField('substring of');
        this.appendValueInput('START')
            .setCheck('Number')
            .appendField('from');
        this.appendValueInput('END')
            .setCheck('Number')
            .appendField('to');
        this.setOutput(true, 'String');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#FFA500');
        this.setTooltip('Extracts a substring from a string between start and end indices.');
    }
};
Blockly.Python['string_substring'] = function(block, generator) {
    const string = generator.valueToCode(block, 'STRING', Blockly.Python.ORDER_NONE) || '""';
    const start = generator.valueToCode(block, 'START', Blockly.Python.ORDER_NONE) || '0';
    const end = generator.valueToCode(block, 'END', Blockly.Python.ORDER_NONE) || '0';
    return [`${string}[${start}:${end}]`, Blockly.Python.ORDER_MEMBER];
};

Blockly.Blocks['dict_create'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('create dictionary')
            .appendField(new Blockly.FieldTextInput('my_dict'), 'NAME');
        this.appendValueInput('KEY')
            .appendField('key');
        this.appendValueInput('VALUE')
            .appendField('value');
        this.setOutput(true, 'Dictionary');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#4B0082');
        this.setTooltip('Creates a dictionary with a specified key-value pair.');
    }
};
Blockly.Python['dict_create'] = function(block, generator) {
    const name = block.getFieldValue('NAME');
    const key = generator.valueToCode(block, 'KEY', Blockly.Python.ORDER_NONE) || '""';
    const value = generator.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || 'None';
    return `${name} = {${key}: ${value}}\n`;
};

Blockly.Blocks['dict_get'] = {
    init: function() {
        this.appendValueInput('KEY')
            .appendField('get from dictionary')
            .appendField(new Blockly.FieldTextInput('my_dict'), 'NAME')
            .appendField('key');
        this.setOutput(true, ['Number', 'String', 'Boolean', 'List', 'Dictionary', 'Tuple', 'Set']);
        this.setColour('#4B0082');
        this.setTooltip('Retrieves a value from a dictionary using a key.');
    }
};
Blockly.Python['dict_get'] = function(block, generator) {
    const name = block.getFieldValue('NAME');
    const key = generator.valueToCode(block, 'KEY', Blockly.Python.ORDER_NONE) || '""';
    return [`${name}[${key}]`, Blockly.Python.ORDER_MEMBER];
};

Blockly.Blocks['dict_set'] = {
    init: function() {
        this.appendValueInput('KEY')
            .appendField('set dictionary')
            .appendField(new Blockly.FieldTextInput('my_dict'), 'NAME')
            .appendField('key');
        this.appendValueInput('VALUE')
            .appendField('to');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#4B0082');
        this.setTooltip('Sets a value in a dictionary for a specified key.');
    }
};
Blockly.Python['dict_set'] = function(block, generator) {
    const name = block.getFieldValue('NAME');
    const key = generator.valueToCode(block, 'KEY', Blockly.Python.ORDER_NONE) || '""';
    const value = generator.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || 'None';
    return `${name}[${key}] = ${value}\n`;
};

Blockly.Blocks['dict_keys'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('keys of dictionary')
            .appendField(new Blockly.FieldTextInput('my_dict'), 'NAME');
        this.setOutput(true, 'List');
        this.setColour('#4B0082');
        this.setTooltip('Returns a list of keys in a dictionary.');
    }
};
Blockly.Python['dict_keys'] = function(block, generator) {
    const name = block.getFieldValue('NAME');
    return [`list(${name}.keys())`, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Blocks['dict_values'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('values of dictionary')
            .appendField(new Blockly.FieldTextInput('my_dict'), 'NAME');
        this.setOutput(true, 'List');
        this.setColour('#4B0082');
        this.setTooltip('Returns a list of values in a dictionary.');
    }
};
Blockly.Python['dict_values'] = function(block, generator) {
    const name = block.getFieldValue('NAME');
    return [`list(${name}.values())`, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Blocks['math_number_open'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('start number')
            .appendField(new Blockly.FieldNumber(0), 'VALUE');
        this.setOutput(true, 'Number');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#008080');
        this.setTooltip('Starts a number block with an initial value.');
    }
};
Blockly.Python['math_number_open'] = function(block, generator) {
    const value = block.getFieldValue('VALUE');
    return [value, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Blocks['number_value'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('number')
            .appendField(new Blockly.FieldNumber(0), 'VALUE');
        this.setOutput(true, 'Number');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#008080');
        this.setTooltip('Creates a number with the specified value.');
    }
};
Blockly.Python['number_value'] = function(block, generator) {
    const value = block.getFieldValue('VALUE');
    return [value, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Blocks['math_operation'] = {
    init: function() {
        this.appendValueInput('A')
            .appendField('calculate');
        this.appendValueInput('B')
            .appendField(new Blockly.FieldDropdown([
                ['+', '+'], ['-', '-'], ['*', '*'], ['/', '/']
            ]), 'OP');
        this.setOutput(true, 'Number');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#008080');
        this.setTooltip('Performs a mathematical operation on two numbers.');
    }
};
Blockly.Python['math_operation'] = function(block, generator) {
    const a = generator.valueToCode(block, 'A', Blockly.Python.ORDER_ADDITIVE) || '0';
    const b = generator.valueToCode(block, 'B', Blockly.Python.ORDER_ADDITIVE) || '0';
    const op = block.getFieldValue('OP');
    const resultVar = Blockly.Variables.generateUniqueName(block.workspace, 'result');
    block.workspace.createVariable(resultVar);
    return [resultVar + ' = ' + a + ' ' + op + ' ' + b, Blockly.Python.ORDER_ASSIGNMENT];
};

Blockly.Blocks['math_compare'] = {
    init: function() {
        this.appendValueInput('A')
            .appendField(new Blockly.FieldDropdown([
                ['==', '=='], ['!=', '!='], ['<', '<'], ['>', '>'], ['<=', '<='], ['>=', '>=']
            ]), 'OP');
        this.appendValueInput('B')
            .setCheck(['Number', 'String']);
        this.setOutput(true, 'Boolean');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#008080');
        this.setTooltip('Compares two values using a specified operator.');
    }
};
Blockly.Python['math_compare'] = function(block, generator) {
    const a = generator.valueToCode(block, 'A', Blockly.Python.ORDER_RELATIONAL) || '0';
    const b = generator.valueToCode(block, 'B', Blockly.Python.ORDER_RELATIONAL) || '0';
    const op = block.getFieldValue('OP');
    return [a + ' ' + op + ' ' + b, Blockly.Python.ORDER_RELATIONAL];
};

Blockly.Blocks['boolean_value'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([['True', 'True'], ['False', 'False']]), 'VALUE');
        this.setOutput(true, 'Boolean');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#C71585');
        this.setTooltip('Sets a boolean value to true or false.');
    }
};
Blockly.Python['boolean_value'] = function(block, generator) {
    const value = block.getFieldValue('VALUE');
    return [value, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Blocks['logic_compare'] = {
    init: function() {
        this.appendValueInput('A')
            .setCheck(['Number', 'String'])
            .appendField(new Blockly.FieldDropdown([
                ['==', '=='], ['!=', '!='], ['<', '<'], ['>', '>'], ['<=', '<='], ['>=', '>=']
            ]), 'OP');
        this.appendValueInput('B')
            .setCheck(['Number', 'String']);
        this.setOutput(true, 'Boolean');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#C71585');
        this.setTooltip('Compares two values with a logical operator.');
    }
};
Blockly.Python['logic_compare'] = function(block, generator) {
    const a = generator.valueToCode(block, 'A', Blockly.Python.ORDER_RELATIONAL) || '0';
    const b = generator.valueToCode(block, 'B', Blockly.Python.ORDER_RELATIONAL) || '0';
    const op = block.getFieldValue('OP');
    return [a + ' ' + op + ' ' + b, Blockly.Python.ORDER_RELATIONAL];
};

Blockly.Blocks['logic_operation'] = {
    init: function() {
        this.appendValueInput('A')
            .setCheck('Boolean')
            .appendField(new Blockly.FieldDropdown([['and', 'and'], ['or', 'or']]), 'OP');
        this.appendValueInput('B')
            .setCheck('Boolean');
        this.setOutput(true, 'Boolean');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#C71585');
        this.setTooltip('Performs a logical operation between two boolean values.');
    }
};
Blockly.Python['logic_operation'] = function(block, generator) {
    const a = generator.valueToCode(block, 'A', Blockly.Python.ORDER_LOGICAL_AND) || 'False';
    const b = generator.valueToCode(block, 'B', Blockly.Python.ORDER_LOGICAL_AND) || 'False';
    const op = block.getFieldValue('OP');
    return [a + ' ' + op + ' ' + b, Blockly.Python.ORDER_LOGICAL_AND];
};

Blockly.Blocks['logic_not'] = {
    init: function() {
        this.appendValueInput('VALUE')
            .setCheck('Boolean')
            .appendField('not');
        this.setOutput(true, 'Boolean');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#C71585');
        this.setTooltip('Negates a boolean value.');
    }
};
Blockly.Python['logic_not'] = function(block, generator) {
    const value = generator.valueToCode(block, 'VALUE', Blockly.Python.ORDER_LOGICAL_NOT) || 'False';
    return ['not ' + value, Blockly.Python.ORDER_LOGICAL_NOT];
};

Blockly.Blocks['tuple_create'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('create tuple')
            .appendField(new Blockly.FieldTextInput('my_tuple'), 'NAME');
        this.appendValueInput('ITEMS')
            .setCheck(['Number', 'String', 'Boolean', 'List', 'Dictionary', 'Tuple', 'Set'])
            .appendField('with items');
        this.setOutput(true, 'Tuple');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#FF7F50');
        this.setTooltip('Creates a tuple with specified items.');
    }
};
Blockly.Python['tuple_create'] = function(block, generator) {
    const name = block.getFieldValue('NAME');
    const items = generator.valueToCode(block, 'ITEMS', Blockly.Python.ORDER_NONE) || '';
    return `${name} = (${items},)\n`;
};

Blockly.Blocks['tuple_get'] = {
    init: function() {
        this.appendValueInput('INDEX')
            .setCheck('Number')
            .appendField('get item from tuple')
            .appendField(new Blockly.FieldTextInput('my_tuple'), 'NAME')
            .appendField('at index');
        this.setOutput(true, ['Number', 'String', 'Boolean', 'List', 'Dictionary', 'Tuple', 'Set']);
        this.setColour('#FF7F50');
        this.setTooltip('Retrieves an item from a tuple at a specified index.');
    }
};
Blockly.Python['tuple_get'] = function(block, generator) {
    const name = block.getFieldValue('NAME');
    const index = generator.valueToCode(block, 'INDEX', Blockly.Python.ORDER_NONE) || '0';
    return [`${name}[${index}]`, Blockly.Python.ORDER_MEMBER];
};

Blockly.Blocks['set_create'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('create set')
            .appendField(new Blockly.FieldTextInput('my_set'), 'NAME');
        this.appendValueInput('ITEMS')
            .setCheck(['Number', 'String'])
            .appendField('with items');
        this.setOutput(true, 'Set');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#9400D3');
        this.setTooltip('Creates a set with specified items.');
    }
};
Blockly.Python['set_create'] = function(block, generator) {
    const name = block.getFieldValue('NAME');
    const items = generator.valueToCode(block, 'ITEMS', Blockly.Python.ORDER_NONE) || '';
    return `${name} = {${items}}\n`;
};

Blockly.Blocks['set_add'] = {
    init: function() {
        this.appendValueInput('ITEM')
            .appendField('add to set')
            .appendField(new Blockly.FieldTextInput('my_set'), 'NAME');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#9400D3');
        this.setTooltip('Adds an item to a set.');
    }
};
Blockly.Python['set_add'] = function(block, generator) {
    const name = block.getFieldValue('NAME');
    const item = generator.valueToCode(block, 'ITEM', Blockly.Python.ORDER_NONE) || 'None';
    return `${name}.add(${item})\n`;
};

Blockly.Blocks['set_remove'] = {
    init: function() {
        this.appendValueInput('ITEM')
            .appendField('remove from set')
            .appendField(new Blockly.FieldTextInput('my_set'), 'NAME');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#9400D3');
        this.setTooltip('Removes an item from a set.');
    }
};
Blockly.Python['set_remove'] = function(block, generator) {
    const name = block.getFieldValue('NAME');
    const item = generator.valueToCode(block, 'ITEM', Blockly.Python.ORDER_NONE) || 'None';
    return `${name}.remove(${item})\n`;
};

Blockly.Blocks['set_union'] = {
    init: function() {
        this.appendValueInput('A')
            .setCheck('Set')
            .appendField('union of set')
            .appendField(new Blockly.FieldTextInput('set1'), 'NAME1');
        this.appendValueInput('B')
            .setCheck('Set')
            .appendField('with set')
            .appendField(new Blockly.FieldTextInput('set2'), 'NAME2');
        this.setOutput(true, 'Set');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#9400D3');
        this.setTooltip('Computes the union of two sets.');
    }
};
Blockly.Python['set_union'] = function(block, generator) {
    const name1 = block.getFieldValue('NAME1');
    const name2 = block.getFieldValue('NAME2');
    return [`${name1}.union(${name2})`, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Blocks['set_intersection'] = {
    init: function() {
        this.appendValueInput('A')
            .setCheck('Set')
            .appendField('intersection of set')
            .appendField(new Blockly.FieldTextInput('set1'), 'NAME1');
        this.appendValueInput('B')
            .setCheck('Set')
            .appendField('with set')
            .appendField(new Blockly.FieldTextInput('set2'), 'NAME2');
        this.setOutput(true, 'Set');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#9400D3');
        this.setTooltip('Computes the intersection of two sets.');
    }
};
Blockly.Python['set_intersection'] = function(block, generator) {
    const name1 = block.getFieldValue('NAME1');
    const name2 = block.getFieldValue('NAME2');
    return [`${name1}.intersection(${name2})`, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Blocks['if_statement'] = {
    init: function() {
        this.appendValueInput('CONDITION')
            .setCheck('Boolean')
            .appendField('if');
        this.appendStatementInput('DO')
            .appendField('do');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#FF4040');
        this.setTooltip('Executes code if a condition is true.');
    }
};
Blockly.Python['if_statement'] = function(block, generator) {
    const condition = generator.valueToCode(block, 'CONDITION', Blockly.Python.ORDER_NONE) || 'False';
    const statements = generator.statementToCode(block, 'DO') || '    pass\n';
    return `if ${condition}:\n${statements}\n`;
};

Blockly.Blocks['while_loop'] = {
    init: function() {
        this.appendValueInput('CONDITION')
            .setCheck('Boolean')
            .appendField('while');
        this.appendStatementInput('DO')
            .appendField('do');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#DC143C');
        this.setTooltip('Repeats code while a condition is true.');
    }
};
Blockly.Python['while_loop'] = function(block, generator) {
    const condition = generator.valueToCode(block, 'CONDITION', Blockly.Python.ORDER_NONE) || 'False';
    const statements = generator.statementToCode(block, 'DO') || '    pass\n';
    return `while ${condition}:\n${statements}\n`;
};

Blockly.Blocks['for_loop'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('for')
            .appendField(new Blockly.FieldTextInput('i'), 'VAR')
            .appendField('in');
        this.appendValueInput('ITERABLE')
            .setCheck(['List', 'String', 'Tuple', 'Set']);
        this.appendStatementInput('DO')
            .appendField('do');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#DC143C');
        this.setTooltip('Iterates over items in an iterable.');
    }
};
Blockly.Python['for_loop'] = function(block, generator) {
    const variable = block.getFieldValue('VAR');
    const iterable = generator.valueToCode(block, 'ITERABLE', Blockly.Python.ORDER_NONE) || '[]';
    const statements = generator.statementToCode(block, 'DO') || '    pass\n';
    return `for ${variable} in ${iterable}:\n${statements}\n`;
};

Blockly.Blocks['break_statement'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('break');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#DC143C');
        this.setTooltip('Exits the current loop prematurely.');
    }
};
Blockly.Python['break_statement'] = function(block, generator) {
    return 'break\n';
};

Blockly.Blocks['continue_statement'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('continue');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#DC143C');
        this.setTooltip('Skips to the next iteration of the current loop.');
    }
};
Blockly.Python['continue_statement'] = function(block, generator) {
    return 'continue\n';
};

Blockly.Blocks['try_catch'] = {
    init: function() {
        this.appendStatementInput('TRY')
            .appendField('try');
        this.appendStatementInput('CATCH')
            .appendField('catch')
            .appendField(new Blockly.FieldTextInput('e'), 'EXCEPTION');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#9932CC');
        this.setTooltip('Tries a block of code and catches exceptions.');
    }
};
Blockly.Python['try_catch'] = function(block, generator) {
    const tryStatements = generator.statementToCode(block, 'TRY') || '    pass\n';
    const exception = block.getFieldValue('EXCEPTION');
    const catchStatements = generator.statementToCode(block, 'CATCH') || '    pass\n';
    return `try:\n${tryStatements}except Exception as ${exception}:\n${catchStatements}\n`;
};

Blockly.Blocks['raise_exception'] = {
    init: function() {
        this.appendValueInput('VALUE')
            .appendField('raise exception');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#9932CC');
        this.setTooltip('Raises an exception with a specified message.');
    }
};
Blockly.Python['raise_exception'] = function(block, generator) {
    const value = generator.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '""';
    return `raise Exception(${value})\n`;
};

Blockly.Blocks['class_define'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('define class')
            .appendField(new Blockly.FieldTextInput('MyClass'), 'NAME');
        this.appendStatementInput('BODY')
            .appendField('do');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#20B2AA');
        this.setTooltip('Defines a new class with a specified name and body.');
    }
};
Blockly.Python['class_define'] = function(block, generator) {
    const name = block.getFieldValue('NAME');
    const body = generator.statementToCode(block, 'BODY') || '    pass\n';
    return `class ${name}:\n${body}\n`;
};

Blockly.Blocks['class_instance'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('create instance of')
            .appendField(new Blockly.FieldTextInput('MyClass'), 'NAME');
        this.setOutput(true, ['Number', 'String', 'Boolean', 'List', 'Dictionary', 'Tuple', 'Set']);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#20B2AA');
        this.setTooltip('Creates an instance of a specified class.');
    }
};
Blockly.Python['class_instance'] = function(block, generator) {
    const name = block.getFieldValue('NAME');
    return [`${name}()`, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Blocks['class_method'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('define method')
            .appendField(new Blockly.FieldTextInput('method'), 'NAME')
            .appendField('in')
            .appendField(new Blockly.FieldTextInput('MyClass'), 'CLASS');
        this.appendDummyInput()
            .appendField('parameters')
            .appendField(new Blockly.FieldTextInput('self'), 'PARAMS');
        this.appendStatementInput('BODY')
            .appendField('do');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#20B2AA');
        this.setTooltip('Defines a method within a specified class.');
    }
};
Blockly.Python['class_method'] = function(block, generator) {
    const name = block.getFieldValue('NAME');
    const params = block.getFieldValue('PARAMS');
    const body = generator.statementToCode(block, 'BODY') || '    pass\n';
    return `def ${name}(${params}):\n${body}\n`;
};

Blockly.Blocks['import_module'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('import')
            .appendField(new Blockly.FieldTextInput('module'), 'NAME');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#FF4500');
        this.setTooltip('Imports a specified module.');
    }
};
Blockly.Python['import_module'] = function(block, generator) {
    const name = block.getFieldValue('NAME');
    return `import ${name}\n`;
};

Blockly.Blocks['module_function'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('call')
            .appendField(new Blockly.FieldTextInput('math'), 'MODULE')
            .appendField('.')
            .appendField(new Blockly.FieldTextInput('function'), 'FUNCTION');
        this.appendDummyInput()
            .appendField('with arguments')
            .appendField(new Blockly.FieldTextInput(''), 'ARGS');
        this.setOutput(true, ['Number', 'String', 'Boolean', 'List', 'Dictionary', 'Tuple', 'Set']);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#FF4500');
        this.setTooltip('Calls a function from a specified module with arguments.');
    }
};
Blockly.Python['module_function'] = function(block, generator) {
    const module = block.getFieldValue('MODULE');
    const func = block.getFieldValue('FUNCTION');
    const args = block.getFieldValue('ARGS');
    return [`${module}.${func}(${args})`, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Blocks['file_open'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('open file')
            .appendField(new Blockly.FieldTextInput('file.txt'), 'NAME')
            .appendField('mode')
            .appendField(new Blockly.FieldDropdown([['read', 'r'], ['write', 'w'], ['append', 'a']]), 'MODE');
        this.setOutput(true, ['Number', 'String', 'Boolean', 'List', 'Dictionary', 'Tuple', 'Set']);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#6A5ACD');
        this.setTooltip('Opens a file in the specified mode.');
    }
};
Blockly.Python['file_open'] = function(block, generator) {
    const name = generator.quote_(block.getFieldValue('NAME'));
    const mode = block.getFieldValue('MODE');
    return [`open(${name}, "${mode}")`, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Blocks['file_read'] = {
    init: function() {
        this.appendValueInput('FILE')
            .appendField('read from file');
        this.setOutput(true, 'String');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#6A5ACD');
        this.setTooltip('Reads content from an open file.');
    }
};
Blockly.Python['file_read'] = function(block, generator) {
    const file = generator.valueToCode(block, 'FILE', Blockly.Python.ORDER_NONE) || 'None';
    return [`${file}.read()`, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Blocks['file_write'] = {
    init: function() {
        this.appendValueInput('FILE')
            .appendField('write to file');
        this.appendValueInput('CONTENT')
            .setCheck('String')
            .appendField('content');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#6A5ACD');
        this.setTooltip('Writes content to an open file.');
    }
};
Blockly.Python['file_write'] = function(block, generator) {
    const file = generator.valueToCode(block, 'FILE', Blockly.Python.ORDER_NONE) || 'None';
    const content = generator.valueToCode(block, 'CONTENT', Blockly.Python.ORDER_NONE) || '""';
    return `${file}.write(${content})\n`;
};

Blockly.Blocks['function_define'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('define function')
            .appendField(new Blockly.FieldTextInput('my_function'), 'NAME');
        this.appendDummyInput()
            .appendField('parameters')
            .appendField(new Blockly.FieldTextInput(''), 'PARAMS');
        this.appendStatementInput('BODY')
            .appendField('do');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#800080');
        this.setTooltip('Defines a new function with specified parameters and body.');
    }
};
Blockly.Python['function_define'] = function(block, generator) {
    const name = block.getFieldValue('NAME');
    const params = block.getFieldValue('PARAMS');
    const body = generator.statementToCode(block, 'BODY') || '    pass\n';
    return `def ${name}(${params}):\n${body}\n`;
};

Blockly.Blocks['function_call'] = {
    init: function() {
        this.appendDummyInput()
            .appendField('call')
            .appendField(new Blockly.FieldTextInput('my_function'), 'NAME');
        this.appendDummyInput()
            .appendField('with arguments')
            .appendField(new Blockly.FieldTextInput(''), 'ARGS');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#800080');
        this.setTooltip('Calls a defined function with specified arguments.');
    }
};
Blockly.Python['function_call'] = function(block, generator) {
    const name = block.getFieldValue('NAME');
    const args = block.getFieldValue('ARGS');
    return `${name}(${args})\n`;
};

Blockly.Blocks['print_statement'] = {
    init: function() {
        this.appendValueInput('VALUE')
            .appendField('print');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#FFA500');
        this.setTooltip('Prints a value to the console.');
    }
};
Blockly.Python['print_statement'] = function(block, generator) {
    const value = generator.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || '""';
    return `print(${value})\n`;
};

Blockly.Blocks['to_string'] = {
    init: function() {
        this.appendValueInput('VALUE')
            .appendField('convert to string');
        this.setOutput(true, 'String');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#00CED1');
        this.setTooltip('Converts a value to a string.');
    }
};
Blockly.Python['to_string'] = function(block, generator) {
    const value = generator.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || 'None';
    return [`str(${value})`, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Blocks['to_number'] = {
    init: function() {
        this.appendValueInput('VALUE')
            .appendField('convert to number');
        this.setOutput(true, 'Number');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#00CED1');
        this.setTooltip('Converts a value to a number.');
    }
};
Blockly.Python['to_number'] = function(block, generator) {
    const value = generator.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || 'None';
    return [`float(${value})`, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Blocks['to_boolean'] = {
    init: function() {
        this.appendValueInput('VALUE')
            .appendField('convert to boolean');
        this.setOutput(true, 'Boolean');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setColour('#00CED1');
        this.setTooltip('Converts a value to a boolean.');
    }
};
Blockly.Python['to_boolean'] = function(block, generator) {
    const value = generator.valueToCode(block, 'VALUE', Blockly.Python.ORDER_NONE) || 'None';
    return [`bool(${value})`, Blockly.Python.ORDER_FUNCTION_CALL];
};