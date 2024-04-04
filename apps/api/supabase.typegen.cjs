const { exec } = require('child_process')
require('dotenv').config({
	path: './.dev.vars',
	debug: true
})
const projectRef = process.env.SUPABASE_PROJECT_REF

exec(
	`npx supabase gen types typescript --project-id "${projectRef}" --schema public > src/db/supabase.generated.types.ts`,
	(error, stdout) => {
		if (error) {
			return console.error(error)
		}
		console.log(stdout)
	},
)
