import { PublicationMetadataV2Input } from '@lens-protocol/client'
import { Profile } from '@lens-protocol/client/dist/declarations/src/graphql/types.generated'

import uploadToIPFS from '../ipfsUpload'
import lensClient from './lensClient'

const createPost = async (
  profile: Profile,
  metadata: PublicationMetadataV2Input
) => {
  const contentURI = await uploadToIPFS(metadata)

  // create a post via dispatcher, you need to have the dispatcher enabled for the profile
  // const viaDispatcherResult =
  //   await lensClient.publication.createPostViaDispatcher({
  //     profileId,
  //     contentURI,
  //     collectModule: {
  //       revertCollectModule: true // collect disabled
  //     },
  //     referenceModule: {
  //       followerOnlyReferenceModule: false // anybody can comment or mirror
  //     }
  //   })
  const profileId: string = profile.id

  // or with typedData that require signature and broadcasting
  const typedDataResult = await lensClient.publication.createPostTypedData({
    profileId,
    contentURI,
    collectModule: {
      freeCollectModule: {
        followerOnly: false
      }
    },
    referenceModule: {
      followerOnlyReferenceModule: false // anybody can comment or mirror
    }
  })

  return typedDataResult
}

export default createPost
