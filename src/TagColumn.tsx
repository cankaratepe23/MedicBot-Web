import React from 'react';
import './TagColumn.css';


interface ITagColumnProps {
    tagCollection: {tagName: any, values: number[]};
}

class TagColumn extends React.Component<ITagColumnProps> {
    render() {
        return (
            <div className="TagColumn">
                <h2 className="TagColumn-header">{this.props.tagCollection.tagName}</h2>
                {this.props.tagCollection.values.map(value => {
                    return (
                        <button>{value}</button>
                    );
                })}
            </div>
        )
    }
}

export default TagColumn;