import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { utilService } from "../services/util.service.js"
import { updateLayoutPrefs } from "../store/actions/layout.actions.js"
import { updateUserPrefs } from "../store/actions/user.actions.js"

const { useState, useEffect } = React
const { useParams, useNavigate, Link } = ReactRouterDOM
const { useSelector, useDispatch } = ReactRedux

export function UserDetails() {
	const user = useSelector((storeState) => storeState.userModule.loggedInUser)
	const isLoading = useSelector((storeState) => storeState.todoModule.isLoading)
	const params = useParams()
	const navigate = useNavigate()
	const [userToEdit, setUserToEdit] = useState(user)
	const dispatch = useDispatch()

	useEffect(() => {
		console.log(user)
	}, [])

	function onSaveUser(ev) {
		ev.preventDefault()
		updateUserPrefs(userToEdit)
			.then(() => {
				showSuccessMsg("User preferences saved successfully")
			})
			.catch((err) => {
				showErrorMsg("Cannot save user preferences")
			})
	}

	function handleChange({ target }) {
		const field = target.name
		let value = target.value

		switch (target.type) {
			case "number":
			case "range":
				value = +value || ""
				break

			case "checkbox":
				value = target.checked
				break

			default:
				value = value
				break
		}
		if (field === "color" || field === "bgColor") {
			setUserToEdit((prevUserToEdit) => ({
				...prevUserToEdit,
				prefs: { ...prefs, [field]: value },
			}))
		} else {
			setUserToEdit((prevUserToEdit) => ({ ...prevUserToEdit, [field]: value }))
		}
	}

	const { fullname, prefs } = userToEdit

	if (isLoading)
		return (
			<div className='loading-container'>
				<div className='loading'></div>
			</div>
		)
	return (
		<section className='user-details'>
			<h2>Profile Preferences</h2>
			<form onSubmit={onSaveUser}>
				<label htmlFor='fullname'>Name:</label>
				<input
					onChange={handleChange}
					placeholder={user.fullname}
					value={fullname}
					type='text'
					name='fullname'
					id='fullname'
				/>

				<label htmlFor='color'>Color:</label>
				<input
					onChange={handleChange}
					value={prefs.color}
					type='color'
					name='color'
					id='color'
				/>

				<label htmlFor='bgColor'>Background Color:</label>
				<input
					onChange={handleChange}
					value={prefs.bgColor}
					type='color'
					name='bgColor'
					id='bgColor'
				/>

				<button>Save</button>
			</form>
			<h1>User Activity:</h1>
			<ul>
				{!user.activities.length && <p>no activities to show...</p>}
				{user.activities.map((activity) => (
					<li key={activity.at}>
						<p>
							{utilService.timeAgo(activity.at)} | {activity.txt}
						</p>
					</li>
				))}
			</ul>
		</section>
	)
}
