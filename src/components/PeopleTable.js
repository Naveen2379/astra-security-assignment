import React, { Component } from 'react';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Highlighter from 'react-highlight-words';
import {Table, Space, Button, Input} from "antd";
import 'antd/dist/antd.css';
import { SearchOutlined } from '@ant-design/icons';
import '../styles/people-table.css';
import {isEmpty} from "lodash";

export default class PeopleTable extends Component {

    state = {
        searchText: '',
        searchedColumn: '',
        people: [],
        searchName: '',
        nameFound: {}
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select(), 100);
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

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
                console.log('input is empty');
                this.setState({
                    nameFound: {}
                });
            }
        })
    }

    render() {
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                ...this.getColumnSearchProps('name'),
            },
            {
                title: 'Height',
                dataIndex: 'height',
                key: 'height',
                ...this.getColumnSearchProps('height'),
            },
            {
                title: 'Mass',
                dataIndex: 'mass',
                key: 'mass',
                ...this.getColumnSearchProps('mass'),
            },
            {
                title: 'hair_color',
                dataIndex: 'hair_color',
                key: 'hair_color',
                ...this.getColumnSearchProps('hair_color'),

            },
            {
                title: 'skin_color',
                dataIndex: 'skin_color',
                key: 'skin_color',
                ...this.getColumnSearchProps('skin_color'),
            },
            {
                title: 'eye_color',
                dataIndex: 'eye_color',
                key: 'eye_color',
                ...this.getColumnSearchProps('eye_color'),
            },
            {
                title: 'birth_year',
                dataIndex: 'birth_year',
                key: 'birth_year',
                ...this.getColumnSearchProps('birth_year'),
            },
            {
                title: 'gender',
                dataIndex: 'gender',
                key: 'gender',
                ...this.getColumnSearchProps('gender'),
            },
            {
                title: 'homeworld',
                dataIndex: 'homeworld',
                key: 'homeworld',
                ...this.getColumnSearchProps('name'),
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
                key: 'created'
            },
            {
                title: 'edited',
                dataIndex: 'edited',
                key: 'edited'
            },
            {
                title: 'url',
                dataIndex: 'url',
                key: 'url',
                ...this.getColumnSearchProps('url'),
            }
        ];
        return (<div>
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
            {isEmpty(this.state.nameFound) ? <Table columns={columns} dataSource={this.props.people} /> : <Table columns={columns} dataSource={this.state.nameFound} />}
        </div>
        )
    }
}