/*
import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
//import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
//import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';


export default class PeopleTable extends Component {

    state = {
        people: [],
        columns: [
            {
                dataField: 'name',
                text: 'name'
            },
            {
                dataField: 'height',
                text: 'height',
                sort: true
            },
            {
                dataField: 'mass',
                text: 'mass',
                sort: true
            },
            {
                dataField: 'hair_color',
                text: 'hair_color',
                sort: true
            },
            {
                dataField: 'skin_color',
                text: 'skin_color',
                sort: true
            },
            {
                dataField: 'eye_color',
                text: 'eye_color',
                sort: true
            },
            {
                dataField: 'birth_year',
                text: 'birth_year',
                sort: true
            },
            {
                dataField: 'gender',
                text: 'gender',
                sort: true
            },
            {
                dataField: 'homeworld',
                text: 'homeworld',
                sort: true
            },
            {
                dataField: 'films',
                text: 'films',
                sort: true
            },
            {
                dataField: 'species',
                text: 'species',
                sort: true
            },{
                dataField: 'vehicles',
                text: 'vehicles',
                sort: true
            },{
                dataField: 'starships',
                text: 'starships',
                sort: true
            },
            {
                dataField: 'created',
                text: 'created',
                sort: true
            },
            {
                dataField: 'edited',
                text: 'edited',
                sort: true
            },
            {
                dataField: 'url',
                text: 'url',
                sort: true
            }
        ]
    }
    /!*componentDidMount() {
        fetch('https://swapi.dev/api/people/?page=2')
            .then(response => response.json())
            .then(res => {
                console.log(res.results);
                const peopleWithIDField = res.results.map( (result, index) => {
                    return {...result, 'id':index};
                })
                console.log(peopleWithIDField);
                return this.setState({
                    people: res.results
                })})
            .catch(err => console.log(err));
    }*!/

    render() {
        /!*const options = {
            page: 2,
            sizePerPageList: [ {
                text: '5', value: 5
            }, {
                text: '10', value: 10
            }, {
                text: 'All', value: this.state.people
            } ],
            sizePerPage: 5,
            pageStartIndex: 0,
            paginationSize: 3,
            prePage: 'Prev',
            firstPage: 'First',
            lastPage: 'Last',
            paginationPosition: 'top'
        };*!/
        return (
            <div className="container">
                <div  className="hdr">
                    <div>
                        React Bootstrap Table with Searching and Custom Pagination
                    </div>
                </div>
                <div className="container" style={{ marginTop: 50 }}>
                    <BootstrapTable
                        striped
                        hover
                        keyField='id'
                        data={ this.state.people }
                        columns={ this.state.columns }
                        /!*filter={ filterFactory() }
                        pagination={ paginationFactory(options) }*!/
                    />
                </div>
            </div>
        )
    }
}

/!*
* class="row"
* class="col-sm-12 btn btn-info"
* *!/*/

