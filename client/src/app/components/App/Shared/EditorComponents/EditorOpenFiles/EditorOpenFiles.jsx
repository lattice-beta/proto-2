import React from 'react';

class EditorOpenFiles extends React.Component {
  render() {
    return (
      <ul>
        {this.props.files.map((file, index) => {
          if (typeof file.isFileInView === 'undefined' || file.isFileInView) {
            return (
              <li>
                <button
                  onClick={() => this.props.setCurrentFile(this.props.id, index)}
                >
                  {file.name}
                </button>
                <button
                  onClick={() => this.props.closeFileView(this.props.id, index)}
                >
                  Close
                </button>
              </li>
            );
          }
        })
        }
      </ul>
    );
  }
}

export default EditorOpenFiles;
