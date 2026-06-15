const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const saveComment = async (data) => {
    const { data: comment, error } = await supabase
        .from('comments')
        .insert([{ username: data.uniqueId, nickname: data.nickname, comment: data.comment }])
        .select()
        .single();
    if (error) throw error;
    return comment;
};

const saveResponse = async (commentId, aiResponse) => {
    const { error } = await supabase.from('responses').insert([{ comment_id: commentId, ai_response: aiResponse }]);
    if (error) throw error;
};

module.exports = { saveComment, saveResponse };
