SET search_path TO qualboa_schema;

-- ============================================
-- USUARIOS DE PRUEBA
-- (no se puede hacer login con estos, son solo para datos)
-- ============================================
INSERT INTO usuario (id_usuario, nome, username, email, telefone, data_nascimento, created_at, senha) VALUES
(10, 'João Mendes', 'joaomendes', 'joao@email.com', '43999001122', '1985-03-15', NOW(), 'test_no_login'),
(11, 'Ricardo Lima', 'ricardolima', 'ricardo@email.com', '43999003344', '1990-07-22', NOW(), 'test_no_login'),
(12, 'Maria Silva', 'mariasilva', 'maria@email.com', '43999005566', '1998-11-08', NOW(), 'test_no_login'),
(13, 'Pedro Santos', 'pedrosantos', 'pedro@email.com', '43999007788', '2000-01-30', NOW(), 'test_no_login'),
(14, 'Ana Oliveira', 'anaoliveira', 'ana@email.com', '43999009900', '1995-06-12', NOW(), 'test_no_login');

INSERT INTO proprietario (id_usuario) VALUES (10), (11);

INSERT INTO cliente (id_usuario, favorito, curtido) VALUES
(12, false, false),
(13, false, false),
(14, false, false);

-- ============================================
-- ENDERECOS (Londrina - PR)
-- ============================================
INSERT INTO endereco (id_endereco, rua, bairro, numero, complemento, id_usuario) VALUES
(10, 'Rua Sergipe', 'Centro', '1234', 'Esquina com Av. Paraná', 10),
(11, 'Av. Higienópolis', 'Higienópolis', '500', NULL, 10),
(12, 'Rua Prefeito Hugo Cabral', 'Centro', '870', 'Subsolo', 11),
(13, 'Av. Madre Leônia Milito', 'Bela Suíça', '1500', NULL, 11),
(14, 'Rua Piauí', 'Centro', '300', 'Cobertura', 10),
(15, 'Av. Ayrton Senna', 'Gleba Palhano', '2000', NULL, 11);

-- ============================================
-- ESTABELECIMENTOS
-- ============================================
INSERT INTO estabelecimento (id_estabelecimento, id_proprietario, qr_code, id_endereco, nome, categoria, descricao, telefone, imagem, latitude, longitude, aberto, media_nota) VALUES
(10, 10, 'qr-bar-joao-001', 10, 'Bar do João', 'Bar/Pub', 'O melhor bar de Londrina! Cervejas artesanais e música ao vivo toda sexta.', '43999111222', 'https://picsum.photos/400/300?random=1', -23.3045, -51.1694, true, 4.2),
(11, 10, 'qr-sky-lounge-002', 11, 'Sky Lounge', 'Bar/Pub', 'Rooftop bar com vista panorâmica. Drinks exclusivos e DJ sets.', '43999333444', 'https://picsum.photos/400/300?random=2', -23.3100, -51.1630, true, 4.5),
(12, 11, 'qr-clube-ouro-003', 12, 'Clube Ouro', 'Club/Baladas', 'A melhor balada de Londrina. 3 ambientes e 2 pistas de dança.', '43999555666', 'https://picsum.photos/400/300?random=3', -23.3008, -51.1712, true, 4.0),
(13, 11, 'qr-arena-music-004', 13, 'Arena Music Hall', 'Show/Evento', 'Casa de shows para 2000 pessoas. Shows nacionais e internacionais.', '43999777888', 'https://picsum.photos/400/300?random=4', -23.3200, -51.1500, false, 4.7),
(14, 10, 'qr-boteco-esquina-005', 14, 'Boteco da Esquina', 'Boteco', 'Boteco raiz com samba e pagode. Feijoada aos sábados!', '43988111222', 'https://picsum.photos/400/300?random=5', -23.3070, -51.1680, true, 3.8),
(15, 11, 'qr-espaco85-006', 15, 'Espaço 85', 'Club/Baladas', 'Balada eletrônica com DJs internacionais. Open bar às quintas.', '43988333444', 'https://picsum.photos/400/300?random=6', -23.3250, -51.1550, true, 4.3);

-- ============================================
-- CARDAPIOS E PRODUTOS
-- ============================================
INSERT INTO cardapio (id_cardapio, id_estabelecimento, data_criado) VALUES
(10, 10, NOW()), (11, 11, NOW()), (12, 12, NOW()), (13, 14, NOW()), (14, 15, NOW());

INSERT INTO produto (id_produto, id_cardapio, nome, preco, descricao, data_incluido) VALUES
-- Bar do João
(10, 10, 'Cerveja Artesanal IPA', 18.90, 'IPA da casa, 500ml', NOW()),
(11, 10, 'Porção de Batata Frita', 32.00, 'Com cheddar e bacon', NOW()),
(12, 10, 'Caipirinha', 22.00, 'De limão, feita na hora', NOW()),
(13, 10, 'Tábua de Frios', 55.00, 'Queijos, embutidos e torradas', NOW()),
-- Sky Lounge
(14, 11, 'Gin Tônica Premium', 35.00, 'Gin importado com tônica artesanal', NOW()),
(15, 11, 'Espumante Taça', 28.00, 'Brut, taça 150ml', NOW()),
(16, 11, 'Bruschetta Italiana', 38.00, 'Tomate, manjericão e azeite trufado', NOW()),
-- Clube Ouro
(17, 12, 'Combo Vodka', 120.00, 'Vodka 750ml + 4 energéticos', NOW()),
(18, 12, 'Cerveja Long Neck', 15.00, 'Premium long neck', NOW()),
(19, 12, 'Água', 8.00, 'Mineral 500ml', NOW()),
-- Boteco da Esquina
(20, 13, 'Chopp Pilsen', 12.00, 'Gelado 300ml', NOW()),
(21, 13, 'Feijoada Completa', 45.00, 'Com arroz, couve e farofa (sábados)', NOW()),
(22, 13, 'Porção de Calabresa', 28.00, 'Acebolada', NOW()),
-- Espaço 85
(23, 14, 'Open Bar', 80.00, 'Bebidas ilimitadas até 2h (quintas)', NOW()),
(24, 14, 'Combo Premium', 150.00, 'Vodka + Whisky + 6 energéticos', NOW());

-- ============================================
-- POSTAGENS (reseñas de clientes)
-- ============================================
INSERT INTO postagem (id_postagem, id_usuario, id_estabelecimento, legenda, avaliacoes, imagem, vibe, musica, fila, preco, seguranca, pessoas, tempo_espera, metodo_presenca, data_postagem) VALUES
(10, 12, 10, 'Melhor bar de Londrina! Cerveja artesanal incrível.', 5, NULL, 'animado', 'MPB ao vivo', 'sem fila', '$$', 'boa', 50, '5 min', 'manual', NOW() - INTERVAL '2 hours'),
(11, 13, 12, 'Balada lotada hoje! DJ muito bom, som pesado.', 3, NULL, 'agitado', 'Eletrônica', 'fila média', '$$$', 'boa', 200, '20 min', 'manual', NOW() - INTERVAL '1 hour'),
(12, 14, 11, 'Vista incrível do rooftop! Drinks caros mas vale.', 8, NULL, 'tranquilo', 'Lounge', 'sem fila', '$$$$', 'excelente', 30, '0 min', 'manual', NOW() - INTERVAL '30 minutes'),
(13, 12, 14, 'Samba de raiz no Boteco! Feijoada sensacional.', 2, NULL, 'animado', 'Samba/Pagode', 'sem fila', '$', 'boa', 40, '0 min', 'manual', NOW() - INTERVAL '5 hours'),
(14, 13, 15, 'Open bar das quintas é imperdível!', 6, NULL, 'agitado', 'EDM', 'fila grande', '$$', 'boa', 300, '30 min', 'manual', NOW() - INTERVAL '3 hours'),
(15, 14, 10, 'Voltei no Bar do João, continua excelente!', 4, NULL, 'animado', 'Rock', 'fila pequena', '$$', 'boa', 60, '10 min', 'manual', NOW() - INTERVAL '45 minutes');

INSERT INTO postagem_cliente (id_postagem, nota) VALUES
(10, 4.5), (11, 4.0), (12, 4.8), (13, 3.5), (14, 4.2), (15, 4.5);

-- ============================================
-- EVENTOS
-- ============================================
INSERT INTO postagem (id_postagem, id_usuario, id_estabelecimento, legenda, avaliacoes, imagem, data_postagem) VALUES
(16, 10, 10, 'Sexta de música ao vivo!', 0, NULL, NOW()),
(17, 11, 13, 'Show especial de sertanejo', 0, NULL, NOW()),
(18, 11, 15, 'Festa Neon - edição aniversário', 0, NULL, NOW());

INSERT INTO postagem_evento (id_postagem, titulo, descricao, promocao, data_evento, imagem) VALUES
(16, 'Sexta ao Vivo', 'Banda Alma Londrinense toca clássicos do rock!', 'Chopp em dobro até 22h', '2026-06-13', NULL),
(17, 'Sertanejo in Concert', 'Dupla sertaneja revelação. Ingressos limitados!', 'Meia entrada estudantes', '2026-06-14', NULL),
(18, 'Festa Neon 5 Anos', '5 anos do Espaço 85 com DJs internacionais!', 'Open bar até 1h', '2026-06-20', NULL);

-- ============================================
-- REACOES
-- ============================================
INSERT INTO reacao (id_reacao, id_usuario, id_postagem, tipo_reacao) VALUES
(10, 13, 10, 'concordar'),
(11, 14, 10, 'concordar'),
(12, 12, 11, 'concordar'),
(13, 14, 11, 'discordar'),
(14, 12, 12, 'concordar'),
(15, 13, 12, 'concordar');

-- ============================================
-- Actualizar sequences para evitar conflictos
-- ============================================
SELECT setval('usuario_id_usuario_seq', (SELECT MAX(id_usuario) FROM usuario));
SELECT setval('endereco_id_endereco_seq', (SELECT MAX(id_endereco) FROM endereco));
SELECT setval('estabelecimento_id_estabelecimento_seq', (SELECT MAX(id_estabelecimento) FROM estabelecimento));
SELECT setval('cardapio_id_cardapio_seq', (SELECT MAX(id_cardapio) FROM cardapio));
SELECT setval('produto_id_produto_seq', (SELECT MAX(id_produto) FROM produto));
SELECT setval('postagem_id_postagem_seq', (SELECT MAX(id_postagem) FROM postagem));
SELECT setval('reacao_id_reacao_seq', (SELECT MAX(id_reacao) FROM reacao));
