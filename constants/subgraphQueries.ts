import { gql } from "@apollo/client"

export const GET_HOMEPAGE_CAMPAIGNS = gql`
  query getHomepageCampaigns{
    campaignAddeds(first: 6, where:{isPublished: true}, orderBy: createdAt, orderDirection: desc) {
      id
      campaignAddress
      creator
    }
  }
`

export const GET_USER_DETAILS = gql`
  query getUserDetails($userAddress: String!){
    userAdded(id:$userAddress){
      id
      address
      username
      email
      shipAddr
      created
      backed
      totalRaised
      totalDonated
      publishedCount
      backedCount
      createdAt
      pfp
	  }
  }
`

export const GET_USER = gql`
  query getUserDetails($userAddress: String!){
    userAdded(id:$userAddress){
      id
      username
	  }
  }
`

export const GET_CAMPAIGN_DETAILS = gql`
  query getCampaignDetails($campaignAddress: String!){
    campaignAdded(id: $campaignAddress){
      campaignAddress
      creator
      funders
      funderCount
      isPublished
    }
  }
`

export const GET_ALL_CAMPAIGNS = gql`
  query getAllCampaigns($offset: Int!){
    campaignAddeds(first: 12, skip: $offset, where:{isPublished:true}, orderBy: createdAt, orderDirection: desc) {
      id
      campaignAddress
      creator
    }
  }
`

export const GET_SOME_CAMPAIGNS = gql`
  query getSomeCampaigns($category: String!, $offset: Int!){
    campaignAddeds(first: 12, skip: $offset, where:{isPublished:true, category: $category}, orderBy: createdAt, orderDirection: desc) {
      id
      campaignAddress
      creator
    }   
  }
`

export const GET_CREATED_CAMPAIGNS = gql`
  query getCreatedCampaigns($profile: String!){
    userAdded(id: $profile){
      created
    }
  }
`

export const GET_BACKED_CAMPAIGNS = gql`
  query getCreatedCampaigns($profile: String!){
    userAdded(id: $profile){
      backed
    }
  }
`

export const SEARCH_CAMPAIGNS = gql`
  query searchCampaigns($term: String!){
    campaignSearch(text: $term, where:{isPublished: true}){
      isPublished
      creator
    }
  }
`

export const CHECK_UVAL = gql`
  query checkUVal($term: String!){
    userAddeds(where:{username: $term}){
      username
    }
  }
`

export const FIND_USER = gql`
  query findUser($name: String!){
    userAddeds(where:{username: $name}){
      id
      address
      username
      email
      shipAddr
      created
      backed
      totalRaised
      totalDonated
      publishedCount
      backedCount
      createdAt
      pfp
    }
  }
`

export const FIND_USERS = gql`
  query findUsers($addresses: [String!]){
    userAddeds(where:{id_in:$addresses}){
      username
    }
  }
`

export const FIND_BACKER_COUNT = gql`
  query findBackerCount($addresses: [String!]){
    campaignAddeds(where:{id_in:$addresses}){
      funders
      funderCount
    }
  }
`

export const FIND_CREATORS_SUPP_COUNT = gql`
  query findCreatorsSuppCount($addresses: [String!]){
    campaignAddeds(where:{id_in:$addresses}){
      creator {
        id
      }
    }
  }
`