export default function BlogCard() {
  return (
    <div className="bc-container fl-cl fl-c">
      <div className="bc-img"> 
        <img src="/assets/manger_blimg-1.jpg" alt="blimg-1" />
      </div>

      <div className="bc-details fl-tl fl-c">
        <div className="bc-blog-title fl-tl fl-c">
          <h4>{"How to tell the story of your creative work"}</h4>
          <p>{"Tips for uncovering the best story of your work that will impress funders, followers and everyone else."}</p>
        </div>

        <button className="bc-blog-cta">{"Read more..."}</button>
      </div>
    </div>
  )
}
