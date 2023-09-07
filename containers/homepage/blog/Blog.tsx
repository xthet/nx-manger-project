import { BlogCard } from "@/components/exportComps"

export default function Blog() {
  return (
    <section className="bl-section sc-padding fl-cl fl-c" id="blog">
      <div className="bl-section-title fl-cl fl-c">
        <h3 className="bl-title">{"BLOG"}</h3>
        <p className="bl-subtitle">{"Learn more about manger"}</p>
      </div>

      <div className="bl-cards-container fl-tc">
        <BlogCard/>
        <BlogCard/>
        <BlogCard/>
      </div>
    </section>
  )
}
