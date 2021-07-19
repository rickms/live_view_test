import React from 'react';
import './App.css';
import {Header} from "./features/common/components/Header";
import {Main} from "./features/common/components/Main"
import {Sidebar} from "./features/common/components/Sidebar"
import Grid from '@material-ui/core/Grid';
import {Errors} from "./features/common/components/Errors";

function App() {

    return (
        <div className="App">
            <Grid container>
                <Grid item xs={12}>
                    <Header/>
                </Grid>
                <Grid item xs={12} >
                    <Grid container>
                        <Grid item xs={12} md={3}>
                            <Sidebar/>
                        </Grid>
                        <Grid item>
                            <Main/>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Errors/>
        </div>
    )
}

export default App;
