import * as React from "react";
import "./assets/scss/App.scss";
import Editor from './components/editor';

// @ts-ignore
// const req = require.context('byted-tui2/lib', true, /^\.\/[^_][\w-]+\/style\/index\.js$/);
// req.keys().filter(key => key.indexOf('icon') < 0).forEach(req)

export interface AppProps {
}

export default class App extends React.Component<AppProps, undefined> {
    render() {
        return (
            <div className="app">
                <h1>Hello World!</h1>
                <Editor
                    editorOptions={{
                        image: {
                            action: '//tuchong.com/rest/ueditor?action=uploadimage&encode=utf-8'
                        }
                    }}
                />
            </div>
        );
    }
}
