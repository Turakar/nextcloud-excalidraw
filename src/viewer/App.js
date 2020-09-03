import React, { useEffect, useState } from "react";
import Excalidraw from "excalidraw";

import "excalidraw/dist/excalidraw.min.css";
import "./styles.css";

export default class App extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            ready: false,
            changed: false,
            data: null,
            width: null,
            height: null,
        };
        this.onResize = () => {
            this.setState({ width: window.innerWidth, height: window.innerHeight });
        };
    }
    
    
    
    componentDidMount() {
        window.addEventListener("resize", this.onResize);
        window.parent.OCA.Excalidraw.load((data) => {
            this.onResize();
            this.setState({ ready: true, changed: false, data: data });
        }, (exc) => {
            console.error(exc);
        });
        this.autosave = window.setInterval(() => {
            if(this.state.changed) {
                window.parent.OCA.Excalidraw.save(this.state.data, (msg) => {}, (msg) => {
                    console.error(msg);
                });
                this.setState({ changed: false });
            }
        }, 1000);
    }
    
    componentWillUnmount() {
        window.removeEventListener("resize", this.onResize);
        window.clearInteval(this.autosave);
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return !(this.state.ready === nextState.ready && this.state.width === nextState.width && this.state.height === nextState.height)
    }

    render() {
        if(this.state.ready) {
            
            const onChange = (elements, state) => {
                this.setState((prevState, props) => {
                    let data = Object.assign(prevState.data, {elements: elements});
                    return {
                        changed: true,
                        data: data,
                    }
                });
            };

            const onUsernameChange = username => {
                // ignore
            };
            
            const width = this.state.width;
            const height = this.state.height;
            const options = { zenModeEnabled: false };
            
            return (
                <div className="App">
                    <Excalidraw
                    width={width}
                    height={height}
                    initialData={this.state.data['elements']}
                    onChange={onChange}
                    user={{ name: "Excalidraw User" }}
                    onUsernameChange={onUsernameChange}
                    options={options}
                    />
                </div>
            );
        } else {
            return (
                <div className="App">
                </div>
            );
        }
    }
}
