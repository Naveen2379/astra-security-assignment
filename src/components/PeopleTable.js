import React, { Component } from 'react';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {Table, Button} from "antd";
import 'antd/dist/antd.css';
import { SearchOutlined } from '@ant-design/icons';
import '../styles/people-table.css';
import {isEmpty} from "lodash";

export default class PeopleTable extends Component {

    state = {
        searchName: '',
        nameFound: {},
        top: 'topLeft',
        bottom: 'totalbottomRight',
        current: 1
    }

    handleSearchName = () => {
        this.setState({ loading: false}, () => {
            fetch(`https://swapi.dev/api/people/?search=${this.state.searchName}`)
                .then(response => response.json())
                .then(result => this.setState({
                    nameFound: result.results
                }, () => console.log(this.state.nameFound)))
        })
    }

    handleNameChange = (e) => {
        this.setState({searchName: e.target.value}, () => {
            if(this.state.searchName === '') {
                this.setState( {
                    nameFound: {}
                }, () => this.props.fetchPeopleData());
            }
        })
    }

    handlePageChange = (pagination, filters, sorter, extra) => {
        //console.log('handlePageChange');
        if(this.state.current !== pagination.current && this.state.current ) {
            this.setState( {
                current: pagination.current
            }, () => this.props.fetchPeopleData(this.state.current));
        }
    }

    render() {
        //console.log('render method in PeopleTable');
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                sorter: (a, b) => a.name.length - b.name.length,
                sortDirections: ['descend'],
            },
            {
                title: 'Height',
                dataIndex: 'height',
                key: 'height',
                sorter: (a, b) => a.height - b.height,
            },
            {
                title: 'Mass',
                dataIndex: 'mass',
                key: 'mass',
                sorter: (a, b) => a.mass - b.mass,
            },
            {
                title: 'hair_color',
                dataIndex: 'hair_color',
                key: 'hair_color',
                sorter: (a, b) => a.hair_color.length - b.hair_color.length,
            },
            {
                title: 'skin_color',
                dataIndex: 'skin_color',
                key: 'skin_color',
                sorter: (a, b) => a.skin_color.length - b.skin_color.length,
            },
            {
                title: 'eye_color',
                dataIndex: 'eye_color',
                key: 'eye_color',
                sorter: (a, b) => a.eye_color.length - b.eye_color.length,
            },
            {
                title: 'birth_year',
                dataIndex: 'birth_year',
                key: 'birth_year',
                sorter: (a, b) => a.birth_year.length - b.birth_year.length,
            },
            {
                title: 'gender',
                dataIndex: 'gender',
                key: 'gender',
                sorter: (a, b) => a.gender.length - b.gender.length,
            },
            {
                title: 'homeworld',
                dataIndex: 'homeworld',
                key: 'homeworld',
                sorter: (a, b) => a.homeworld.length - b.homeworld.length,
            },
            {
                title: 'films',
                dataIndex: 'films',
                key: 'films',
                render: films => (
                    <>
                        {films.map(film => {
                            return (
                                <p key={film}>
                                    {film}
                                </p>
                            );
                        })}
                    </>
                )
            },
            {
                title: 'species',
                dataIndex: 'species',
                key: 'species'
            },
            {
                title: 'vehicles',
                dataIndex: 'vehicles',
                key: 'vehicles',
                render: vehicles => (
                    <>
                        {vehicles.map(vehicle => {
                            return (
                                <p key={vehicle}>
                                    {vehicle}
                                </p>
                            );
                        })}
                    </>
                )
            },
            {
                title: 'starships',
                dataIndex: 'starships',
                key: 'starships',
                render: starships => (
                    <>
                        {starships.map(starship => {
                            return (
                                <p key={starship}>
                                    {starship}
                                </p>
                            );
                        })}
                    </>
                )
            },
            {
                title: 'created',
                dataIndex: 'created',
                key: 'created',
            },
            {
                title: 'edited',
                dataIndex: 'edited',
                key: 'edited',
            },
            {
                title: 'url',
                dataIndex: 'url',
                key: 'url',
                sorter: (a, b) => a.url.length - b.url.length,
            }
        ];
        const { people, nextURL, noOfPages } =this.props;
        //console.log('peopleTable ', nextURL);
        return (
            <div>
                <div className={'name-search'}>
                    <input type={'text'} value={this.state.searchName} placeholder={'enter name to search'}
                           onChange={this.handleNameChange} />
                    <Button
                        onClick={this.handleSearchName}
                        icon={<SearchOutlined />}
                        style={{ width: 30, height: 30, border: "none" }}
                    >
                    </Button>
                </div>
                {
                    isEmpty(this.state.nameFound) ? <Table columns={columns} dataSource={people}
                                                           pagination={{ position: [this.state.top, this.state.bottom], total: noOfPages*10 }}
                                                           onChange={ this.handlePageChange}
                        /> :
                        <Table columns={columns} dataSource={this.state.nameFound} />
                }
            </div>
        )
    }
}