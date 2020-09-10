import React, { Component } from 'react';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {Table} from "antd";
import 'antd/dist/antd.css';

import '../styles/people-table.css';
import { faQuestion, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faAndroid} from "@fortawesome/free-brands-svg-icons";


export default class PeopleTable extends Component {
    state = {
        searchName: '',
        current: 1,
        sortedInfo: null
    }

    handlePageChange = (pagination, filters, sorter) => {
        this.setState( {
            sortedInfo: sorter
        });

        if(this.state.current !== pagination.current) {
            this.setState( {
                current: pagination.current,
                sortedInfo: null
            }, () => this.props.fetchPeopleData(this.state.current));
        }
    }

    render() {
        let { sortedInfo } = this.state;
        sortedInfo = sortedInfo || {};
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                sorter: (a, b) => a.name.localeCompare(b.name),
                sortDirections: ['ascend', 'descend'],
                sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
            },
            {
                title: 'Height',
                dataIndex: 'height',
                key: 'height',
                sorter: (a, b) => a.height - b.height,
                sortOrder: sortedInfo.columnKey === 'height' && sortedInfo.order,
            },
            {
                title: 'Mass',
                dataIndex: 'mass',
                key: 'mass',
                sorter: (a, b) => a.mass - b.mass,
                sortOrder: sortedInfo.columnKey === 'mass' && sortedInfo.order,
            },
            {
                title: 'hair_color',
                dataIndex: 'hair_color',
                key: 'hair_color',
                sorter: (a, b) => a.hair_color.length - b.hair_color.length,
                sortOrder: sortedInfo.columnKey === 'hair_color' && sortedInfo.order,
            },
            {
                title: 'skin_color',
                dataIndex: 'skin_color',
                key: 'skin_color',
                sorter: (a, b) => a.skin_color.length - b.skin_color.length,
                sortOrder: sortedInfo.columnKey === 'skin_color' && sortedInfo.order,
            },
            {
                title: 'eye_color',
                dataIndex: 'eye_color',
                key: 'eye_color',
                sorter: (a, b) => a.eye_color.length - b.eye_color.length,
                sortOrder: sortedInfo.columnKey === 'eye_color' && sortedInfo.order,
            },
            {
                title: 'birth_year',
                dataIndex: 'birth_year',
                key: 'birth_year',
                sorter: (a, b) => a.birth_year.length - b.birth_year.length,
                sortOrder: sortedInfo.columnKey === 'birth_year' && sortedInfo.order,
            },
            {
                title: 'gender',
                dataIndex: 'gender',
                key: 'gender',
                sorter: (a, b) => a.gender.length - b.gender.length,
                sortOrder: sortedInfo.columnKey === 'gender' && sortedInfo.order,
            },
            {
                title: 'homeworld',
                dataIndex: 'homeworld',
                key: 'homeworld',
                sorter: (a, b) => a.homeworld.length - b.homeworld.length,
                sortOrder: sortedInfo.columnKey === 'homeworld' && sortedInfo.order,
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
                key: 'species',
                render: (species) => {
                    switch (species) {
                        case 'Droid':
                            return <FontAwesomeIcon icon={faAndroid} />;
                        case 'Human':
                            return <FontAwesomeIcon icon={faUserCircle} />;
                        default:
                            return <FontAwesomeIcon icon={faQuestion} />
                    }
                }
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
                sortOrder: sortedInfo.columnKey === 'url' && sortedInfo.order,
            }
        ];
        const { people, noOfPages } =this.props;
        return (
                <Table columns={columns}
                       dataSource={people}
                       pagination={{ total: noOfPages*10 }}
                       onChange={this.handlePageChange}
                       rowKey={'name'}
                       bordered
                />
        )
    }
}