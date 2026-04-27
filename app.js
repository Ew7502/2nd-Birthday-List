import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://svhwpscnnxqwmzhmcqda.supabase.co/rest/v1/', 'sb_publishable_jTRYYEXlB-0h1SbUwvIejg_sRuM7Fsa')

// 1. Create a New List
async function createNewList(userPassword) {
  const uniqueID = Math.random().toString(36).substring(2, 8); // Simple unique ID
  
  const { data, error } = await supabase
    .from('lists')
    .insert([{ share_code: uniqueID, password_hash: userPassword }]);

  if (!error) alert("Your List ID is: " + uniqueID);
}

// 2. Add an Item (Checks password)
async function addItem(listID, password, itemData) {
  // We call a 'stored procedure' so the password isn't exposed
  const { data, error } = await supabase.rpc('secure_add_item', {
    input_code: listID,
    input_password: password,
    item_name: itemData.name,
    item_price: itemData.price,
    item_link: itemData.link
  });
}

// 3. Mark as Bought (No password needed for family)
async function markAsBought(itemId) {
  await supabase
    .from('items')
    .update({ is_bought: true })
    .eq('id', itemId);
}
