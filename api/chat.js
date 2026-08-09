module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY não configurada no projeto da Vercel.' });
    return;
  }
  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Nenhuma mensagem recebida.' });
      return;
    }
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 1000,
        system:
          "Você é o pedro.bot, uma 'segunda mente' que ajuda a pessoa a resolver dúvidas do dia a dia. Responda em português do Brasil, de forma direta, clara e curta (poucos parágrafos), sem enrolação. Seja prestativo e vá direto ao ponto, mas com um tom próximo e humano.",
        messages
      })
    });
    const data = await anthropicResponse.json();
    if (!anthropicResponse.ok) {
      res.status(anthropicResponse.status).json({ error: data.error?.message || 'Erro na API da Anthropic.' });
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    console.error('pedro.bot backend error:', err);
    res.status(500).json({ error: 'Erro interno ao falar com a IA.' });
  }
};
