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
  background-size: contain;
`

const makeSureItsAnImg = (url) => {
  const regex = new RegExp(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/)
  return regex.test(url)
}

class ParentWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      prefetchedImages: [],
      albumCoverUrls: []
    }
  }

  fetchRedditImages = async () => {
    const response = await fetch('https://www.reddit.com/r/fakealbumcovers/top.json?limit=100')
    if (response.ok) {
      const albumJson = await response.json()
      this.setState({
        albumCoverUrls: albumJson.data.children
          .filter((album) => makeSureItsAnImg(album.data.url))
          .map((album) => album.data.url)
      })
    } else {
      alert("HTTP-Error: " + response.status);
    }
  }

  prefetchImages = () => {
    // Make a copy of stateful prefetched images
    const prefetchedImages = [...this.state.prefetchedImages]
    // Only load two more images
    for (let i = 0; i < 2; i++) {
      // If the total album covers from reddit equals the stored prefetched images, break
      if (this.state.albumCoverUrls.length === this.state.prefetchedImages.length) {
        break
      }
      let difference = this.state.albumCoverUrls.filter(x => !prefetchedImages.includes(x));
      const randomUrl = difference[getRandomInt(difference.length)]
      if (randomUrl) {
        prefetchedImages.push(randomUrl)
      }
    }
    this.setState({
      prefetchedImages
    })
  }

  async componentDidMount() {
    await this.fetchRedditImages()
    this.randomize()
  }

  getRandomAlbum = () => {
    const randomIndex = getRandomInt(this.props.data.edges.length)
    this.setState({ 
      albumName: this.props.data.edges[randomIndex].node.title,
      date: this.props.data.edges[randomIndex].node.date,
    })
  }

  randomize = () => {
    this.getRandomAlbum()
    if (this.state.albumCoverUrls.length !== this.state.prefetchedImages.length) {
      this.prefetchImages()
    }

    // Select a random image from the prefetched image array that isn't the current image
    const filteredAlbumCovers = this.state.prefetchedImages.filter((album) => album !== this.state.albumCover)
    const randomIndex = getRandomInt(filteredAlbumCovers.length)
    const albumCover = filteredAlbumCovers[randomIndex]
    this.setState({
      albumCover
    })
  }

  render() {
    return (
      <div key="parentWrapper" css={tw`flex flex-col items-center justify-center`}>
        <div css={css`position: absolute; top: -999999px; left: -99999px;`}key="mainImageWrapper">
          {this.state.prefetchedImages.map((imageUrl, index) => {
            return <img src={imageUrl} key={index} />
          })}
        </div>
        <AlbumWrapper src={this.state.albumCover} albumName={this.state.albumName}></AlbumWrapper>
        <RandomizerButton onClick={this.randomize}>Random</RandomizerButton>
        <div>{(() => {
          const date = new Date()
          return new Date(Date.parse(this.state.date)).toDateString()
        })()}</div>
      </div>
    )
  }
}

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
    allMongodbAlbumnamesrealAlbums {
      edges {
        node {
          title
          date
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
      albumCovers: [],
    }
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

  render() {


    return (
      <>
      <Main src={this.props.src}>
        <Album albumName={this.props.albumName} color={fontColorContrast(this.state.randomBgColor)}></Album>
      </Main>
      
      </>
    )
  }
}

export default ({data}) => (
  <Wrapper>
    <SEO title="Home" />
    <ParentWrapper data={data.allMongodbAlbumnamesrealAlbums}></ParentWrapper>
  </Wrapper>
)