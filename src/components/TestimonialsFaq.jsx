import React, { useState } from "react";
import "../styles/testimonials-faq.css";

const testimonials = [
  {
    name: "Parent of Aarav",
    location: "New Jersey",
    message:
      "My child waits every week for the Ojas art class. The sessions are fun, creative, and very engaging.",
    rating: "★★★★★"
  },
  {
    name: "Parent of Meera",
    location: "India",
    message:
      "The teaching style is very friendly. My daughter became more confident with drawing and coloring.",
    rating: "★★★★★"
  },
  {
    name: "Parent of Vihaan",
    location: "Online Batch",
    message:
      "We loved the story-led activities. Every class feels fresh and my child enjoys showing his artwork.",
    rating: "★★★★★"
  }
];

const faqs = [
  {
    question: "What age group can join Ojas art classes?",
    answer:
      "Children from age 3 to 18 can join. Classes are planned based on age, comfort level, and creativity."
  },
  {
    question: "Is the trial class free?",
    answer:
      "Yes. Parents can book a free trial session from the home page before joining regular classes."
  },
  {
    question: "Are classes online or offline?",
    answer:
      "Ojas focuses on live online art classes. Students can join using the live class link shared by admin."
  },
  {
    question: "How will students get the live class link?",
    answer:
      "After registration, admin enables the live class link. Students can login using registered email and phone to view their class link."
  },
  {
    question: "Do students need art materials?",
    answer:
      "Basic drawing sheets, pencil, eraser, crayons, color pencils, sketch pens, or paints are enough for most classes."
  },
  {
    question: "Can students submit their artworks?",
    answer:
      "Yes. Students can submit activity drawings. Admin reviews and approves selected artworks for the public gallery."
  }
];

function TestimonialsFaq({ onBookDemo }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  return (
    <section className="testimonials-faq-section" id="faq">
      <div className="testimonials-area">
        <div className="tf-title-wrap">
          <span>💙 Parent Love</span>
          <h2>What parents say</h2>
          <p>
            Ojas by Tejas helps children explore colors, imagination, and
            confidence through joyful art learning.
          </p>
        </div>

        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <article className="testimonial-card" key={testimonial.name}>
              <div className="testimonial-stars">{testimonial.rating}</div>

              <p>“{testimonial.message}”</p>

              <div>
                <strong>{testimonial.name}</strong>
                <small>{testimonial.location}</small>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="faq-area">
        <div className="tf-title-wrap">
          <span>❓ Quick Answers</span>
          <h2>Frequently Asked Questions</h2>
          <p>
            Common questions parents ask before joining live online art classes.
          </p>
        </div>

        <div className="faq-layout">
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <article
                className={
                  openFaqIndex === index ? "faq-item open" : "faq-item"
                }
                key={faq.question}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaqIndex(openFaqIndex === index ? -1 : index)
                  }
                >
                  <span>{faq.question}</span>
                  <strong>{openFaqIndex === index ? "−" : "+"}</strong>
                </button>

                {openFaqIndex === index && <p>{faq.answer}</p>}
              </article>
            ))}
          </div>

          <div className="faq-cta-card">
            <span>🎨 Start with a free session</span>
            <h3>Still have questions?</h3>
            <p>
              Book a free trial session and let your child experience the Ojas
              art learning style.
            </p>

            <button type="button" onClick={onBookDemo}>
              Book Free Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsFaq;