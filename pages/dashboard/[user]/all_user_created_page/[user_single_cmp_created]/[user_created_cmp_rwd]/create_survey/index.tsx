import DashboardPath from "@/components/dashboard_path"
import s from "./create_survey.module.sass"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"

export default function CreateSurvey() {
	const [grandSurveyArray, setGrandSurveyArray] = useState<any[]>([])

	function createSingleQuestion() {
		const sq = {
			type: "single",
			question: "",
		}
		setGrandSurveyArray((prev) => [...prev, sq])
	}

	function createMultiQuestion() {
		const mq = {
			type: "multi",
			question: "",
			options: [],
		}

		setGrandSurveyArray((prev) => [...prev, mq])
	}

	return (
		<main className={s.create_survey}>
			<DashboardPath />
			<div className={s.header}>
				<h2>Create Survey</h2>
				<div className={s.details}>
					<span>0.05 ETH reward</span>
					<span>|</span>
					<span>38 backers</span>
					<span>|</span>
					<span>Palomino Vol 2 & 3</span>
				</div>
			</div>
			<div className={s.notice}>
				<h4>Important reminders</h4>
				<ul>
					<li>
						Surveys can only be sent once per reward. Ask for everything you
						need.
					</li>
					<li>
						Backers are required to answer all questions. Only ask questions
						that everyone must answer.
					</li>
					<li>
						Marketing or demographic-related questions are strictly prohibited.
					</li>
					<li>
						If possible, wait until the reward is ready to ship before asking
						for mailing addresses. People move!
					</li>
				</ul>
			</div>
			<section className={s.survey_creator}>
				<main className={s.edit}>
					<h2>Edit</h2>

					<div className={s.ed_introduction}>
						<p>Introduction to survey</p>
						<textarea
							className={s.ed_text_area}
							cols={30}
							rows={3}
							defaultValue="darkplanetcomics needs some info from you to deliver your reward."
							placeholder="darkplanetcomics needs some info from you to deliver your reward."
						/>
					</div>

					<div className={s.ed_enquiry}>
						<div className={s.ed_shipping_details}>
							<p>Name & address</p>
						</div>
						<FontAwesomeIcon icon={faXmark} className={s.x_icon} />
					</div>

					<div className={s.ed_enquiry}>
						<div className={s.ed_single_question}>
							<input type="text" />
						</div>
						<FontAwesomeIcon icon={faXmark} className={s.x_icon} />
					</div>

					<div className={s.ed_enquiry}>
						<div className={s.ed_multi_question}>
							<input type="text" />
							<div className={s.ed_multi_options}>
								<div className={s.ed_option}>
									<span>Option one</span>
									<FontAwesomeIcon icon={faXmark} className={s.x_icon} />
								</div>
								<div className={s.ed_option}>
									<span>Option one</span>
									<FontAwesomeIcon icon={faXmark} className={s.x_icon} />
								</div>
								<div className={s.ed_option}>
									<span>Option one</span>
									<FontAwesomeIcon icon={faXmark} className={s.x_icon} />
								</div>
								<span className={s.ed_add_option}>Add another option</span>
							</div>
						</div>
						<FontAwesomeIcon icon={faXmark} className={s.x_icon} />
					</div>

					{/* <div className={s.separator} /> */}
					<div className={s.ed_add_questions}>
						<button
							onClick={() => {
								createSingleQuestion()
							}}
						>
							Add question
						</button>
						<button
							onClick={() => {
								createMultiQuestion()
							}}
						>
							Add multiple choice
						</button>
					</div>
					<div className={s.separator} />
					<div className={s.ed_save_cancel}>
						<button>Send survey</button>
						<span>Cancel</span>
					</div>
				</main>

				{/* PREVIEW */}
				<aside className={s.preview}>
					<h2>Preview</h2>
					<p className={s.pr_intro}>
						darkplanetcomics needs some info from you to deliver your reward.
					</p>
					<div className={s.separator} />

					<div className={s.pr_enquiry}>
						<div className={s.pr_shipping_details}>
							<h4>Shipping details</h4>
							<input type="text" className={s.pr_input} placeholder="Country" />
							<input type="text" className={s.pr_input} placeholder="Name" />
							<div className={s.pr_input_small}>
								<input
									type="text"
									className={s.pr_input}
									placeholder="Address 1"
								/>
								<small>Street Address, P.O. box</small>
							</div>
							<input type="text" className={s.pr_input} placeholder="City" />
							<input type="text" className={s.pr_input} placeholder="State" />
							<input
								type="text"
								className={s.pr_input}
								placeholder="Zip or Postal Code"
							/>
						</div>
					</div>

					<div className={s.separator} />

					<div className={s.pr_enquiry}>
						<div className={s.pr_single_question}>
							<label className={s.pr_question_label}>
								Did you select more than one reward tier?
							</label>
							<input
								type="text"
								className={s.pr_input}
								placeholder="required"
								required
							/>
						</div>
					</div>

					<div className={s.separator} />

					<div className={s.pr_enquiry}>
						<div className={s.pr_multi_question}>
							<label className={s.pr_question_label}>
								For how many Lynx did you pledge?
							</label>
							<div className={s.pr_options}>
								<div className={s.pr_option}>
									<input type="radio" required className={s.pr_option_radio} />
									<span>Option one</span>
								</div>
								<div className={s.pr_option}>
									<input type="radio" required className={s.pr_option_radio} />
									<span>Option one</span>
								</div>
								<div className={s.pr_option}>
									<input type="radio" required className={s.pr_option_radio} />
									<span>Option one</span>
								</div>
							</div>
						</div>
					</div>
				</aside>
			</section>
		</main>
	)
}
