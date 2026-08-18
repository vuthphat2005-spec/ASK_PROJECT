const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://frgurgughpsvlvalhttl.supabase.co';
const supabaseKey = 'sb_secret_qJUPifWSNJV1yRzL5kSbhw_023Pqaix';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateRole() {
  const { data, error } = await supabase
    .from('nhan_su')
    .update({ vai_tro: 'Admin' })
    .eq('email', 'vuthphat2005@gmail.com')
    .select();

  if (error) {
    console.error('Error updating role:', error);
  } else {
    console.log('Successfully updated role to Admin:', data);
  }
}

updateRole();
