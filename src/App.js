import React, { useState, useEffect } from 'react'
import { ListGroup, Navbar } from 'react-bootstrap'
import './App.css'

const GRAPHQL_ENDPOINT = `https://bazookaand.herokuapp.com/v1alpha1/graphql`
const FETCH_THOUGHTS_QUERY = `
  query {
    thoughts {
      id
      text
    }
  }
`

const App = () => {
  return (
    <div className="container">
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>Thoughts</Navbar.Brand>
      </Navbar>
      <Query
        query={FETCH_THOUGHTS_QUERY}
      >
        <Thoughts/>
      </Query>
    </div>
  )
}

const Thoughts = ({ data, error, loading}) => {
  if (loading) {
    return "Loading"
  }
  if (error) {
    return "Error"
  }
  return (
    <ListGroup>
      {
        data.thoughts.map(({text, id}) => <ListGroup.Item key={id.toString()}>{text}</ListGroup.Item>)
      }
    </ListGroup>
  )
}

const Query = ({children, query, variables}) => {
  const graphqlState = useQuery(query, variables)
  return (
    <div>
      {
        React.Children.map(children, child =>
          React.cloneElement(child, { ...graphqlState })
        )
      }
    </div>
  )
}

const useQuery = (query, variables) => {
  const [graphqlState, setGraphqlState] = useState({
    data: null,
    error: null,
    loading: true
  })
  const makeRequest = async () => {
    try {
      const response = await fetch(
        GRAPHQL_ENDPOINT,
        {
          method: 'POST',
          body: JSON.stringify({
            query,
            variables: variables || {}
          })
        }
      )
      const responseObj = await response.json()
      setGraphqlState({
        data: responseObj.data,
        error: responseObj.errors || responseObj.error,
        loading: false
      })
    } catch (e) {
      setGraphqlState({
        data: null,
        error: e,
        loading: false
      })
    }
  }
  useEffect(() => {
    makeRequest()
  }, [query])
  return graphqlState
}

export default App
