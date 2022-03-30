import React from 'react';
import './AudioTable.css';
import TagColumn from './TagColumn';

class AudioTable extends React.Component {
    readonly jsonData = [{"tagName":"anan","values":[1,2,3,4]},{"tagName":"baban","values":[5,6,7,8]},{"tagName":"caca","values":[9,10,11,12]},{"tagName":"pepe","values":[13,14,15,16]}];
    render() {
        return (
            <div className="AudioTable">
                {this.jsonData.map((tagCollection) => {
                    return (
                        <TagColumn tagCollection={tagCollection}/>
                    );
                })}
            </div>
        )
    }

}

export default AudioTable;