import tw from "tailwind.macro"
import React from "react"
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import SEO from "../components/seo"
import { graphql } from 'gatsby'
import fontColorContrast from 'font-color-contrast'
import axios from 'axios'


const Wrapper = tw.div`
  flex items-center justify-center flex-col h-screen
`

const Main = styled('div')`
  ${tw`p-8 bg-gray-100 rounded-lg shadow-2xl items-center justify-center flex relative`}
  height: 500px;
  width: 500px;
  background: url(${(props) => props.src});
  background-position: center;
`

const Heading = styled('h1')`
  ${tw`text-2xl text-white uppercase font-sans z-10`}
  background: rgba(0,0,0,0.3);
  padding: 20px;
`

const Album = (props) => {
  return (
    <Heading>{props.albumName}</Heading>
  )
}

export const query = graphql`
  query AlbumQuery {
    allTwitterStatusesUserTimelineAlbumNames {
      edges {
        node {
          full_text
        }
      }
    }
    allReddit(limit: 100) {
      edges {
        node {
          newListings {
            url
          }
        }
      }
    }
  }
`

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomBgColor() {
  return "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);})
}

const RandomizerButton = tw.a`
  mt-12 border py-4 px-8 cursor-pointer bg-green-600 text-white select-none shadow-xl
`

const AlbumCover = tw.img`
  absolute z-0
`


class AlbumWrapper extends React.Component {

  constructor(props) {
    super(props)
    this.state = { 
      randomAlbum: getRandomInt(200),
      randomBgColor: getRandomBgColor(),
      randomImgIndex: getRandomInt(20),
      albumCovers: {},
    }
  }

  randomize = () => {
    this.getRandomAlbum()
    this.getRandomBgColor()
    this.getRandomImg()
  }

  getRandomImg = () => {
    this.setState({ randomImgIndex: getRandomInt(20) })
  }

  getRandomAlbum = () => {
    this.setState({ randomAlbum: getRandomInt(200) })
  }

  getRandomBgColor = () => {
    this.setState({
      randomBgColor: getRandomBgColor()
    })
  }

  // getRedditStuff = async () => {
  //   const response = await fetch('//www.reddit.com/r/fakealbumcovers/top.json?limit=100')
  //   if (response.ok) {
  //     const albumJson = await response.json()
  //     this.setState({
  //       albumCovers: albumJson.data.children
  //     })
  //     console.log(this.state.albumCovers[0].data.url)
  //   } else {
  //     alert("HTTP-Error: " + response.status);
  //   }

  // }

  // componentDidMount() {
  //   this.getRedditStuff()
  // }

  render() {


    return (
      <>
      <Main src={this.props.images[this.state.randomImgIndex].url}>
        <Album color={fontColorContrast(this.state.randomBgColor)} albumName={this.props.albumNames.edges[this.state.randomAlbum].node.full_text}></Album>
      </Main>
      <RandomizerButton onClick={this.randomize}>Random</RandomizerButton>
      </>
    )
  }
}

export default ({data}) => (
  <Wrapper>
    <SEO title="Home" />
    <AlbumWrapper images={data.allReddit.edges[0].node.newListings} albumNames={data.allTwitterStatusesUserTimelineAlbumNames}></AlbumWrapper>
    
  </Wrapper>
)