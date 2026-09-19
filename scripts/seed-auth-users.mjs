import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const accounts = [
  { email: 'user@mugsandco.com', password: 'MugsUser2026!', displayName: 'Mugs & Co. User', role: 'user' },
  { email: 'admin@mugsandco.com', password: 'MugsAdmin2026!', displayName: 'Mugs & Co. Admin', role: 'admin' },
]

const { data: userList, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })
if (listError) throw listError

for (const account of accounts) {
  const existing = userList.users.find((user) => user.email?.toLowerCase() === account.email)
  const result = existing
    ? await supabase.auth.admin.updateUserById(existing.id, { password: account.password, email_confirm: true, user_metadata: { display_name: account.displayName } })
    : await supabase.auth.admin.createUser({ email: account.email, password: account.password, email_confirm: true, user_metadata: { display_name: account.displayName } })
  if (result.error) throw result.error

  const userId = result.data.user.id
  const { error: profileError } = await supabase.from('profiles').upsert({ id: userId, display_name: account.displayName, role: account.role })
  if (profileError) throw profileError
  console.log(`${account.role}: ${account.email}`)
}

console.log('Accounts ready. Use /auth to sign in.')
