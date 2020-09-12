import React, {Component} from 'react';
import PeopleTable from "./PeopleTable";
import {faExclamationCircle, faExclamationTriangle, faSpinner} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {isEmpty} from "lodash";
import {Button, Col, Input, Row, Card} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import '../styles/StarWarHomePage.css';


class StarWarHomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            people: [],
            speciesCountObj: {},
            nextURL: '',
            noOfPages: 1,
            visitedPages: [],
            loading: false,
            errorOccured: false
        }
    }

    componentDidMount() {
        this.fetchDataForFirstPage();
    }

    fetchDataForFirstPage = () => {
        fetch('https://swapi.dev/api/people/')
            .then( response => response.json())
            .then( result => {
                if(result.next) {
                    this.dataFetchWithNextURL(result, 1);
                }
                else {
                    this.dataFetchWithOutNextURL(result, 1);
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    errorOccured: true
                });
            });
    }

    fetchURLsFromSpecies = (peopleResult) => {
        console.log(peopleResult);
        const peopleWithSpecies = peopleResult.results.map( (eachObj) => {
            if(eachObj.species[0] !== undefined) {
                return eachObj.species[0];
            }
            return null;
        });
        const extractedURLs = peopleWithSpecies.filter( (url) => url!=null);
        let finalPeopleResult = [];
        let finalResultPromise;
        finalResultPromise = Promise.all( extractedURLs.map((url)=>fetch(url)))
            .then( responses => Promise.all(responses.map( (response) => response.json())))
            .then( results => {
                console.log(results);
                let speciesCountObj = {};
                let replaceInd = 0;
                finalPeopleResult = peopleResult.results.map( (eachObj) => {
                    if (eachObj.species[0]) {
                        eachObj = {...eachObj, ['species']: results[replaceInd].name};
                        replaceInd++;
                        if(eachObj.species in speciesCountObj) {
                            const count = speciesCountObj[eachObj.species];
                            speciesCountObj = {...speciesCountObj, [eachObj.species]: parseInt(count) + 1 };
                        }
                        else {
                            speciesCountObj = {...speciesCountObj, [eachObj.species]: 1 };
                        }
                    }
                    else {
                        eachObj = {...eachObj, ['species']: null}
                    }
                    return eachObj;
                })
                return {finalPeopleResult, speciesCountObj};
            });
            return finalResultPromise;
    }

    dataFetchWithNextURL = (peopleResult, pageClicked) => {
        this.fetchURLsFromSpecies(peopleResult)
            .then(finalPeopleWithSpecies => {
                const {finalPeopleResult, speciesCountObj} = finalPeopleWithSpecies;
                console.log(finalPeopleResult);
                console.log(speciesCountObj);
                return this.setState( (prevState) => {
                 return {
                     speciesCountObj: speciesCountObj,
                     people: finalPeopleResult,
                     nextURL: peopleResult.next,
                     noOfPages: prevState.noOfPages + 1,
                     visitedPages: [...new Set([...this.state.visitedPages, pageClicked])]
                 }
             })
            })
    }

    dataFetchWithOutNextURL = (peopleResult, pageClicked) => {
        this.fetchURLsFromSpecies(peopleResult)
            .then(finalPeopleWithSpecies => {
                const {finalPeopleResult, speciesCountObj } = finalPeopleWithSpecies;
                console.log(finalPeopleResult);
                console.log(speciesCountObj);
                this.setState({
                    speciesCountObj: speciesCountObj,
                    people: finalPeopleResult,
                    nextURL: peopleResult.next,
                    visitedPages: [...new Set([...this.state.visitedPages, pageClicked])]
                });
            })
    }

    fetchDataForVisitedPage = (pageClicked) => {
        const url = `http://swapi.dev/api/people/?page=${pageClicked}`;
        fetch(url)
            .then(response => response.json())
            .then( peopleResult => {
                this.fetchURLsFromSpecies(peopleResult)
                    .then(finalPeopleWithSpecies => {
                        const {finalPeopleResult, speciesCountObj} =finalPeopleWithSpecies;
                        this.setState({
                            speciesCountObj: speciesCountObj,
                            people: finalPeopleResult,
                            visitedPages: [...new Set([...this.state.visitedPages, pageClicked])]
                        });
                    })
            })
    }

    fetchPeopleData = (pageClicked) => {
            if(this.state.visitedPages.includes(pageClicked) ) {
                this.fetchDataForVisitedPage(pageClicked);
            }
            else {
                fetch(this.state.nextURL)
                    .then(response => response.json())
                    .then(result => {
                        if(result.next) {
                            this.dataFetchWithNextURL(result, pageClicked);
                        }
                        else {
                            this.dataFetchWithOutNextURL(result, pageClicked);
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        this.setState({
                            errorOccured: true
                        });
                    });
            }
    }

    fetchOnSearchName = () => {
        const name = this.state.searchName;
            if(name) {
                this.setState({
                    loading: true
                }, () => {
                    fetch(`https://swapi.dev/api/people/?search=${name}`)
                        .then(response => response.json())
                        .then(result => this.setState({
                            loading: false,
                            people: result.results,
                            noOfPages: 1,
                            nextURL: '',
                            visitedPages: [],
                            errorOccured: false
                        }));
                })
            }
            else {
                this.fetchDataForFirstPage();
            }
    }

    handleNameChange = (e) => {
        this.setState({
            searchName: e.target.value
        })
    }

    render() {
        const {speciesCountObj, people, errorOccured, loading} = this.state;
        const speciesCount = <div>{
            Object.keys(speciesCountObj).map( (element) => {
                return <p key={element}><b>{element}</b>: <span>{speciesCountObj[element]}</span></p>
            })
        }</div>
        return (
            <Col classpeciesCountsName={'search-table-style'}>
                <Row className={'name-search'}>
                    <Row className={'search-button'}>
                        <Input type={'text'}
                               value={this.state.searchName}
                               placeholder={'enter name to search'}
                               onChange={this.handleNameChange} />
                        <Button
                            onClick={this.fetchOnSearchName}
                            icon={<SearchOutlined />}
                            style={{ width: 30, height: 30, border: "none" }}
                        >
                        </Button>
                    </Row>
                </Row>
                <Row className={'table-style'}>
                    {
                        errorOccured ? <FontAwesomeIcon icon={faExclamationCircle} size="6x" /> :
                            <>
                                {
                                    loading ? <FontAwesomeIcon icon={faSpinner} size="6x" /> :
                                    <>{
                                        isEmpty(people) ? <FontAwesomeIcon icon={faExclamationTriangle} size="6x" /> :
                                            <PeopleTable people={people}
                                                         noOfPages={this.state.noOfPages}
                                                         fetchPeopleData={this.fetchPeopleData}
                                            />
                                    }
                                    </>
                                }
                            </>
                    }
                </Row>
                <Row>
                    <div className="site-card-border-less-wrapper">
                        <Card title="Count Card" bordered={false} style={{ width: 300 }}>
                            <p><b>results: </b>{people.length}</p>
                            <div>{speciesCount}</div>
                        </Card>
                    </div>,
                </Row>
            </Col>
        );
    }
}

export default StarWarHomePage;