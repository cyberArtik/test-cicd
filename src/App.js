import React from 'react'
import { useState } from 'react'
import logo from './logo.svg';
import Post from './Post'
import { useQuery } from 'react-query';
import client from './react-query-client'


const fetcher = url => fetch(url).then(res => res.json());

function App() {

  const [postID, setPostID] = useState(null)
  const { isLoading, data: posts } = useQuery('posts', () => fetcher('https://jsonplaceholder.typicode.com/posts'), {
    select: posts => posts.slice(0, 5)
  })

  if (isLoading) return <h1>Loading...</h1>

  if (postID !== null) {
    return <Post postID={postID} goBack={() => setPostID(null)} />
  }

  function mutateTitle(id){
    client.setQueryData(['post', id], oldData => {
      if(oldData) {
        return {
          ...oldData,
          title: 'boom boom mutated'
        }
      }
    })
  }

  return (
    <div className='App'>
      {posts.map(post => {

        const cachedPost = client.getQueryData(['post', post.id]);

        return <p key={post.id}>
          <b>{cachedPost ? '(visited)' : ''}</b><a onClick={() => setPostID(post.id)} href="#">{post.id} - {post.title}</a>
          <button onClick={() => mutateTitle(post.id)}>mutate The Title</button>
          </p>
      })}
    </div>

  );
}

export default App;
