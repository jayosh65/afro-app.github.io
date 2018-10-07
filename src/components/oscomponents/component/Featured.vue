<template>
  <a class="card-link" :href="`#/restaurant/${link}`">
    <article class="blog-card">
      <img class="post-image" :src="src" />
      <div class="article-details text-xs-left ">
        <h3 v-if="name !== ''" class="post-title">{{ name }}</h3>
        <h4 v-if="category !== ''" class="post-category ">{{ category }}</h4>
        <p v-if="desc !== ''" class="post-description truncate">{{ desc }}</p>
        <p v-if="author !== ''" class="post-author">{{ author }}</p>
      </div>
    </article>
  </a>
</template>

<script>
  export default {
    props: { 
      src: String,        
      name: {
        type: String,
        default: ''
      },
      category: {
        type: String,
        default: ''
      },
      image: String,
      author: {
        type: String,
        default: ''
      },
      desc: {
        type: String,
        default: ''
      },
      link: {
        type: String
      }          
    },
    // data () {
    //   return {
    //     name: '10 Best Things to Do in Seattle',
    //     category: '',
    //     image: 'https://source.unsplash.com/DnWYw0zLJBg',
    //     author: '',
    //     desc: `Seattle is a seaport city on the west coast of the United States...`
    //   }
    // }, 
  }
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:400,700');
.blog-card {
    display: flex;
    flex-direction: row;
    background: #fff;
    box-shadow: 0 0.1875rem 1.5rem rgba(0, 0, 0, 0.2);
    border-radius: 0.375rem;
    overflow: hidden;
}

.card-link {
    position: relative;
    display: block;
    color: inherit;
    text-decoration: none;
}

.card-link:hover .post-title {
    transition: color 0.3s ease;
    color: #e04f62;
}

.card-link:hover .post-image {
    transition: opacity 0.3s ease;
    opacity: 0.9;
}

.post-image {
    transition: opacity 0.3s ease;
    display: block;
    width: 100%;
    object-fit: cover;
}

.article-details {
    padding: 1.5rem;
}

.post-category {
    display: inline-block;
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.0625rem;
    margin: 0 0 0.75rem 0;
    padding: 0 0 0.25rem 0;
}

.post-title {
    transition: color 0.3s ease;
    font-size: 1.125rem;
    line-height: 1.4;
    color: #121212;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
}

.post-author {
    font-size: 0.875rem;
    line-height: 1;
    margin: 1.125rem 0 0 0;
    padding: 1.125rem 0 0 0;
    border-top: 0.0625rem solid #ebebeb;
}

@media (max-width: 40rem) {
    .blog-card {
        flex-wrap: wrap;
    }
}

@supports (display: grid) {
    .post-image {
        height: 100%;
    }
    .blog-card {
        display: grid;
        grid-template-columns: 1fr 2fr;
        grid-template-rows: 1fr;
    }
    @media (max-width: 40rem) {
        .blog-card {
            grid-template-columns: auto;
            grid-template-rows: 12rem 1fr;
        }
    }
}
</style>
