import React, {useState, useEffect} from 'react';
import Autocomplete from 'react-autocomplete';

const AutocompleteSearch = ({
    items, 
    name, 
    className, 
    label, 
    renderItems, 
    setObject, 
    setInputValue, 
    placeholder, 
    handleSearch, 
    defaultValue, 
    disabled, 
    label2
}) => {
    const [value, setvalue] = useState('');
    // Set default value in autocomplete
    useEffect(() => {
        setInputValue(value);
    },[value, setInputValue]);
    
    useEffect(() => {
        setvalue(defaultValue);
    },[defaultValue]);
    
    return (
        <Autocomplete
            getItemValue={(item) => {
                if(label2 && value && (value === item[label] || value === item[label2])){
                    setObject(item); 
                } else if(value && value === item[label]) {
                    setObject(item); 
                }
                return item[label];
            }}
            items={items}
            shouldItemRender={(item, value) => {
                if(label2){
                    return item[label].toLowerCase().indexOf(value.toLowerCase()) > -1 || item[label2].toLowerCase().indexOf(value.toLowerCase()) > -1;
                }
                return item[label].toLowerCase().indexOf(value.toLowerCase()) > -1
            }}
            renderItem={renderItems}
            value={value}
            onChange={(e) => {
                if(!e.target.value) setObject({});
                setvalue(e.target.value);
                if(handleSearch)
                handleSearch(e.target.value);
            }}
            onSelect={(val) => setvalue(val)}
            renderInput={props => <input {...props}
                    type="text"
                    name={name}
                    className={className}
                    placeholder={placeholder}
                    onBlur={(e) => setInputValue(e.target.value)}
                    disabled={disabled}
                />}
                wrapperStyle={{ style: {display: 'inline-block'} }}
                renderMenu={(items) => {
                return <div style={{maxHeight: '150px', overflow: 'auto'}} children={items} />;
            }}
        />
    )
}

AutocompleteSearch.defaultProps = {
    placeholder: 'Search',
    handleSearch: null,
    defaultValue: '',
    disabled: false,
    label2: null,
    setInputValue: () => false
}
    
export default AutocompleteSearch;