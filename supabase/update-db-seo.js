/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manual dotenv parsing
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] ? match[2].trim() : '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    env[match[1]] = value;
  }
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  console.log('Fetching existing profiles...');
  const { data: profiles, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1);

  if (fetchError) {
    console.error('Error fetching profile:', fetchError);
    return;
  }

  if (!profiles || profiles.length === 0) {
    console.log('No profile found to update.');
    return;
  }

  const profile = profiles[0];
  console.log('Found profile:', { id: profile.id, name: profile.name, meta_title: profile.meta_title });

  const updatedMetaTitle = 'Vinit Soni Full-Stack Developer';
  const updatedMetaDesc = 'Vinit Soni Full-Stack Developer: Building scalable web and mobile applications with clean code and exceptional user experiences.';
  const updatedBio = 'I am Vinit Soni, a Full-Stack Developer and MCA student. I build fast, reliable web and mobile apps. I focus on clean code, modern architecture, and exceptional user experiences.';
  
  console.log(`Updating profile ID ${profile.id} with:`);
  console.log(`- meta_title: "${updatedMetaTitle}"`);
  console.log(`- meta_description: "${updatedMetaDesc}"`);
  console.log(`- bio: "${updatedBio}"`);

  const { data: updatedData, error: updateError } = await supabase
    .from('profiles')
    .update({
      meta_title: updatedMetaTitle,
      meta_description: updatedMetaDesc,
      bio: updatedBio,
      updated_at: new Date().toISOString()
    })
    .eq('id', profile.id)
    .select();

  if (updateError) {
    console.error('Error updating profile:', updateError);
  } else {
    console.log('Successfully updated profile in Supabase:', updatedData);
  }
}

run();
