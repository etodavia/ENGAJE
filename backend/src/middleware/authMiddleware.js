/**
 * Middleware de autorização por perfil (RBAC) para os endpoints do protótipo App Engaje.
 * Perfis suportados: 'consultora', 'gestor_unidade', 'lider_setor'.
 * Nunca expõe dados sensíveis e identifica claramente o contexto de demonstração.
 */

const VALID_ROLES = ['consultora', 'gestor_unidade', 'lider_setor'];

function attachDemoProfile(req, res, next) {
  const headerRole = req.headers['x-engaje-role'] || req.query.perfil || 'consultora';
  const role = VALID_ROLES.includes(headerRole) ? headerRole : 'consultora';

  req.userProfile = {
    role,
    isDemo: true,
    permissions: {
      canCreateTraining: role === 'consultora' || role === 'gestor_unidade',
      canCreateActionPlan: role === 'consultora' || role === 'gestor_unidade',
      canUpdateActionPlan: VALID_ROLES.includes(role),
      canToggleRoutine: VALID_ROLES.includes(role),
      canCreateRoutine: role === 'consultora' || role === 'gestor_unidade' || role === 'lider_setor'
    }
  };

  next();
}

function requireRole(allowedRoles = VALID_ROLES) {
  return (req, res, next) => {
    const currentRole = req.userProfile?.role || 'consultora';
    if (!allowedRoles.includes(currentRole)) {
      return res.status(403).json({
        ok: false,
        error: 'Acesso restrito para o perfil selecionado neste modo de demonstração.',
        requiredRoles: allowedRoles,
        currentRole
      });
    }
    next();
  };
}

module.exports = {
  attachDemoProfile,
  requireRole,
  VALID_ROLES
};
