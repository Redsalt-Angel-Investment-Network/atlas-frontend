export const locales = ["en", "fr"] as const;
export type Locale = typeof locales[number];

export const messages = {
  en: {
    LocaleSwitcher: {
      switchTo: "Switch to {language}",
    },
    topNav: {
      home: "Home",
      team: "Team",
      breadcrumbs: {
        home: "Home",
        team: "Team",
      },
      toggleTheme: "Toggle theme",
      light: "Light",
      dark: "Dark",
      system: "System",
      notifications: "Notifications",
      markAllRead: "Mark all read",
      viewAllActivity: "View all activity",
      upgradePlan: "Upgrade Plan",
      profile: "Profile",
      settings: "Settings",
      security: "Security",
      logOut: "Log out",
      loggedOutSuccessfully: "Logged out successfully",
      logoutFailed: "Unable to log out. Please try again.",
    },
    sidebar: {
      switchWorkspace: "Switch Workspace",
      selectWorkspace: "Select workspace",
      loading: "Loading...",
      createWorkspace: "Create new workspace",
      failedToLoadWorkspaces: "Failed to load workspaces",
      overview: "Overview",
      entities: "Entities",
      workflows: "Workflows",
      categorySchemas: "Categories",
      aiAgents: "AI Agents",
      executionsAndLogs: "Executions & Logs",
      toolsAndConnectors: "Tools & Connectors",
      sharedWorkflows: "Shared Workflows",
      teamAndPermissions: "Team & Permissions",
      settings: "Settings",
      invitePeople: "Invite people",
      helpAndGuides: "Help & guides",
    },
    Login: {
      title: "Sign in",
      subtitle: "Enter your credentials to access your account.",
      email: "Email",
      password: "Password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      submit: "Sign In",
      submitting: "Signing in...",
      noAccount: "Don't have an account?",
      createAccount: "Create account",
      success: "Login successful.",
      invalidCredentials: "Invalid email or password.",
      emailInvalid: "Please enter a valid email address.",
      passwordRequired: "Password is required.",
    },
    Register: {
      title: "Create Account",
      subtitle: "Create your account to get started.",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      submit: "Create Account",
      submitting: "Creating account...",
      hasAccount: "Already have an account?",
      signIn: "Sign in",
      success: "Account created successfully.",
      unable: "Unable to create your account.",
      emailExists: "An account with this email already exists.",
      passwordWeak: "Password is too weak. Please choose a stronger password.",
      firstNameRequired: "First name is required.",
      firstNameTooLong: "First name is too long.",
      lastNameTooLong: "Last name is too long.",
      emailInvalid: "Please enter a valid email address.",
      passwordMin: "Password must be at least 8 characters.",
      passwordMismatch: "Passwords do not match.",
    },
    team: {
      modals: {
        deactivateMember: {
          title: "Deactivate Member",
          subtitle: "Are you sure you want to deactivate this member?",
          description:
            "Are you sure you want to deactivate this member? They will no longer have access to the team.",
          warning:
            "This will immediately revoke their access to the workspace and team resources. Their account data will be preserved, and you can reactivate them later.",
          deactivating: "Deactivating...",
          cancel: "Cancel",
          deactivate: "Deactivate",
        },
      },
    },
    categories: {
      title: "Categories",
      description:
        "Define, structure, and manage attribute schemas across your workspace categories.",
      createSchema: "Create Category",
      searchPlaceholder: "Search categories by name or key...",
      filter: "Filter",
      propertiesCount: "{count, plural, =1 {1 property} other {# properties}}",
      table: {
        schemaName: "Category Name",
        description: "Description",
        fields: "Fields",
        status: "Status",
        lastUpdated: "Last Updated",
        actions: "Actions",
      },
      status: {
        allStatuses: "All Statuses",
        active: "Active",
        inactive: "Inactive",
      },
      emptyState: {
        title: "No categories found",
        searchNoResults: "Try matching a different keyword.",
        noData: "Get started by creating your first category.",
      },
      actions: {
        srLabel: "Actions",
        edit: "Edit Category ",
        delete: "Delete",
      },
      createCategoryForm: {
        title: "Create Category",
        description:
          "Configure category metadata and define dynamic schema fields.",
        basicDetails: "Basic Details",
        fields: {
          name: {
            label: "Category Name",
            placeholder: "e.g. Laptops & Computers",
            required: "Category name is required",
            maxLength: "Name must be less than 100 characters",
          },
          slug: {
            label: "Slug",
            placeholder: "laptops-computers",
            required: "Slug is required",
            pattern: "Lowercase letters, numbers, and hyphens only",
          },
          reference: {
            label: "Reference Code",
            placeholder: "CAT-HW-001",
            required: "Reference code is required",
            maxLength: "Reference code must be under 50 characters",
          },
          description: {
            label: "Description",
            placeholder: "Brief description of this category...",
            maxLength: "Description must be under 500 characters",
          },
          isActive: {
            label: "Active Status",
            description: "Enable visibility across workspace workflows",
          },
        },
        schemaFields: {
          title: "Schema Fields",
          subtitle: "Define properties required for items in this category.",
          addField: "Add Field",
          emptyState:
            'No custom fields added yet. Click "Add Field" to configure schema attributes.',
          keyPlaceholder: "field_key (e.g. serial_number)",
          keyRequired: "Field key is required",
          keyPattern: "Letters, numbers, and underscores only",
          typeSelectPlaceholder: "Type",
          typeRequired: "Type is required",
          requiredShort: "Req",
          types: {
            text: "Text",
            number: "Number",
            boolean: "Boolean",
            date: "Date",
            json: "JSON",
            select: "Select",
          },
        },
        buttons: {
          cancel: "Cancel",
          submit: "Create Category",
          submitting: "Creating...",
        },
        zodValidation: {
          nameRequired: "Category name is required",
          nameMaxLength: "Category name must be less than 100 characters",
          descriptionMaxLength: "Description must be less than 500 characters",
          typeRequired: "Field type is required",
          regexPattern: "Use letters, numbers, and underscores only",
          fieldNameRequired: "Field name is required",
        },
        toast: {
          success: "Category created successfully.",
          error: "Failed to create category. Please try again.",
        },
      },
      modals: {
        deleteCategory: {
          title: "Delete Category",
          subtitle:
            "Are you sure you want to delete this category? This action cannot be undone.",
          warning:
            "Deleting this category will remove its schema configuration. Existing workspace items linked to this schema may lose their custom attribute data.",
          cancel: "Cancel",
          delete: "Delete Category",
          deleting: "Deleting...",
          deleteSuccess: "Category deleted successfully.",
          deleteError: "Failed to delete category. Please try again.",
        },
      },
      editCategoryForm: {
        title: "Edit Category",
        description:
          "Update category details and configure custom attribute fields.",
        basicDetails: "Basic Details",
        fields: {
          name: {
            label: "Category Name",
            placeholder: "e.g. Electronics, Laptops",
          },
          description: {
            label: "Description",
            placeholder: "Brief description of this category...",
          },
          isActive: {
            label: "Active Status",
            description: "Enable visibility across workspace workflows",
          },
        },
        schemaFields: {
          title: "Schema Fields",
          subtitle: "Define properties required for items in this category.",
          addField: "Add Field",
          emptyState:
            'No custom fields added yet. Click "Add Field" to configure schema attributes.',
          keyPlaceholder: "field_key (e.g. serial_number)",
          keyRequired: "Field key is required",
          keyPattern: "Letters, numbers, and underscores only",
          typeSelectPlaceholder: "Type",
          typeRequired: "Type is required",
          requiredShort: "Req",
          types: {
            text: "Text",
            number: "Number",
            boolean: "Boolean",
            date: "Date",
            json: "JSON",
            select: "Select",
          },
        },
        buttons: {
          cancel: "Cancel",
          submit: "Save Changes",
          submitting: "Saving...",
        },
        toast: {
          error: "Failed to update category. Please try again.",
          success: "Category updated successfully.",
        },
        zodValidation: {
          nameRequired: "Category name is required",
          nameMaxLength: "Category name must be less than 100 characters",
          descriptionMaxLength: "Description must be less than 500 characters",
          typeRequired: "Field type is required",
          regexPattern: "Use letters, numbers, and underscores only",
          fieldNameRequired: "Field name is required",
        },
      },
    },
    entities: {
      title: "Entities",
      subtitle: "Manage entities across your workspace",
      searchPlaceholder: "Search by name, reference, or category...",
      noEntities: "No entities found",
      noEntitiesWithFilters: "Try adjusting your filters or search terms",
      noEntitiesEmpty: "Create your first entity to get started",
      newEntity: "New Entity",
      unknownCategory: "Unknown Category",
      filters: {
        allCategories: "All Categories",
        allStatuses: "All Statuses",
      },
      statuses: {
        active: "Active",
        archived: "Archived",
      },
      noAttributes: "No attributes",
      loading: "Loading entities...",
      noWorkspace:
        "No workspace selected. Choose a workspace to view entities.",
      selectAll: "Select all entities",
      selectEntity: "Select entity",
      table: {
        entity: "Entity",
        reference: "Reference",
        category: "Category",
        status: "Status",
        created: "Created",
        attributes: "Attributes",
        actions: "Actions",
      },
      detail: {
        viewDetails: "View Details",
      },
      actions: {
        srLabel: "Actions",
        edit: "Edit",
        duplicate: "Duplicate",
        archive: "Archive",
      },
      modals: {
        deleteEntity: {
          title: "Delete Entity",
          subtitle:
            "Are you sure you want to delete this entity? This action cannot be undone.",
          warning:
            "Deleting this entity will remove it from the workspace. Any custom attribute data associated with this entity will also be deleted.",
          cancel: "Cancel",
          delete: "Delete Entity",
          deleting: "Deleting...",
          deleteSuccess: "Entity deleted successfully.",
          deleteError: "Failed to delete entity. Please try again.",
        },
      },
      "createEntityForm": {
        "title": "Create Entity",
        "description": "Create an entity using the fields defined by its category.",
        "basicDetails": "Basic Details",
        "fields": {
          "name": {
            "label": "Entity Name",
            "placeholder": "Enter entity name"
          },
          "category": {
            "label": "Category",
            "placeholder": "Select a category"
          },
          "schemaVersion": "Schema Version",
          "valuePlaceholder": "Enter {field}"
        },
        "attributes": {
          "title": "Entity Attributes",
          "description": "The fields below are generated automatically from the selected category.",
          "noFields": "This category has no additional fields.",
          "selectCategory": "Select a category to generate its fields."
        },
        "validation": {
          "nameRequired": "Entity name is required.",
          "nameMaxLength": "Entity name must be 255 characters or fewer.",
          "categoryRequired": "Category is required.",
          "fieldIdRequired": "A valid field ID is required.",
          "fieldRequired": "This field is required.",
          "schemaNotFound": "The category schema could not be found.",
          "invalidNumber": "Please enter a valid number.",
          "invalidJson": "Please enter valid JSON."
        },
        "buttons": {
          "cancel": "Cancel",
          "create": "Create Entity",
          "creating": "Creating..."
        },
        "toast": {
          "success": "Entity created successfully.",
          "error": "Failed to create entity. Please try again."
        }
      },
    },
  },
  fr: {
    LocaleSwitcher: {
      switchTo: "Passer en {language}",
    },
    topNav: {
      home: "Accueil",
      team: "Équipe",
      breadcrumbs: {
        home: "Accueil",
        team: "Équipe",
      },
      toggleTheme: "Changer le thème",
      light: "Clair",
      dark: "Sombre",
      system: "Système",
      notifications: "Notifications",
      markAllRead: "Tout marquer comme lu",
      viewAllActivity: "Voir toute l’activité",
      upgradePlan: "Mettre à niveau l’abonnement",
      profile: "Profil",
      settings: "Paramètres",
      security: "Sécurité",
      logOut: "Se déconnecter",
      loggedOutSuccessfully: "Déconnexion réussie",
      logoutFailed: "Impossible de se déconnecter. Veuillez réessayer.",
    },
    sidebar: {
      switchWorkspace: "Changer d’espace de travail",
      selectWorkspace: "Sélectionner un espace de travail",
      loading: "Chargement...",
      createWorkspace: "Créer un nouvel espace de travail",
      overview: "Vue d’ensemble",
      entities: "Entités",
      workflows: "Flux de travail",
      categorySchemas: "Catégorie",
      aiAgents: "Agents IA",
      executionsAndLogs: "Exécutions et journaux",
      toolsAndConnectors: "Outils et connecteurs",
      sharedWorkflows: "Flux de travail partagés",
      teamAndPermissions: "Équipe et autorisations",
      settings: "Paramètres",
      invitePeople: "Inviter des personnes",
      helpAndGuides: "Aide et guides",
      failedToLoadWorkspaces: "Échec du chargement des espaces de travail",
    },
    Login: {
      title: "Connexion",
      subtitle: "Entrez vos identifiants pour accéder à votre compte.",
      email: "E-mail",
      password: "Mot de passe",
      rememberMe: "Se souvenir de moi",
      forgotPassword: "Mot de passe oublié ?",
      submit: "Se connecter",
      submitting: "Connexion…",
      noAccount: "Vous n'avez pas de compte ?",
      createAccount: "Créer un compte",
      success: "Connexion réussie.",
      invalidCredentials: "E-mail ou mot de passe invalide.",
      emailInvalid: "Veuillez entrer une adresse e-mail valide.",
      passwordRequired: "Le mot de passe est requis.",
    },
    Register: {
      title: "Créer un compte",
      subtitle: "Créez votre compte pour commencer.",
      firstName: "Prénom",
      lastName: "Nom",
      email: "E-mail",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      submit: "Créer un compte",
      submitting: "Création du compte…",
      hasAccount: "Vous avez déjà un compte ?",
      signIn: "Se connecter",
      success: "Compte créé avec succès.",
      unable: "Impossible de créer votre compte.",
      emailExists: "Un compte avec cet e-mail existe déjà.",
      passwordWeak:
        "Le mot de passe est trop faible. Veuillez en choisir un plus fort.",
      firstNameRequired: "Le prénom est requis.",
      firstNameTooLong: "Le prénom est trop long.",
      lastNameTooLong: "Le nom est trop long.",
      emailInvalid: "Veuillez entrer une adresse e-mail valide.",
      passwordMin: "Le mot de passe doit contenir au moins 8 caractères.",
      passwordMismatch: "Les mots de passe ne correspondent pas.",
    },
    team: {
      modals: {
        deactivateMember: {
          title: "Désactiver le membre",
          subtitle: "Êtes-vous sûr de vouloir désactiver ce membre ?",
          description:
            "Êtes-vous sûr de vouloir désactiver ce membre ? Il n'aura plus accès à l'équipe.",
          warning:
            "Cela révoquera immédiatement son accès à l'espace de travail et aux ressources de l'équipe. Ses données de compte seront conservées et vous pourrez le réactiver ultérieurement.",
          deactivating: "Désactivation en cours...",
          cancel: "Annuler",
          deactivate: "Désactiver",
        },
      },
    },
    categories: {
      title: "Catégories",
      description:
        "Définissez, structurez et gérez les schémas d'attributs dans les catégories de votre espace de travail.",
      createSchema: "Créer une catégorie",
      searchPlaceholder: "Rechercher des catégories par nom ou clé...",
      filter: "Filtrer",
      propertiesCount:
        "{count, plural, =0 {0 propriété} =1 {1 propriété} other {# propriétés}}",
      table: {
        schemaName: "Nom du catégorie",
        description: "Description",
        fields: "Champs",
        status: "Statut",
        lastUpdated: "Dernière mise à jour",
        actions: "Actes",
      },
      status: {
        allStatuses: "Tous les statuts",
        active: "Actif",
        inactive: "Inactif",
      },
      emptyState: {
        title: "Aucune catégorie trouvée",
        searchNoResults: "Essayez avec un autre mot-clé.",
        noData: "Commencez par créer votre première catégorie.",
      },
      actions: {
        srLabel: "Actions",
        edit: "Modifier la catégorie",
        delete: "Supprimer",
      },
      createCategoryForm: {
        title: "Créer une catégorie",
        description:
          "Configurer les métadonnées de la catégorie et définir les champs de schéma dynamiques.",
        basicDetails: "Informations de base",
        fields: {
          name: {
            label: "Nom de la catégorie",
            placeholder: "ex. Ordinateurs portables",
            required: "Le nom de la catégorie est requis",
            maxLength: "Le nom doit contenir moins de 100 caractères",
          },
          slug: {
            label: "Slug",
            placeholder: "ordinateurs-portables",
            required: "Le slug est requis",
            pattern: "Lettres minuscules, chiffres et tirets uniquement",
          },
          reference: {
            label: "Code de référence",
            placeholder: "CAT-MAT-001",
            required: "Le code de référence est requis",
            maxLength:
              "Le code de référence doit contenir moins de 50 caractères",
          },
          description: {
            label: "Description",
            placeholder: "Brève description de cette catégorie...",
            maxLength: "La description doit contenir moins de 500 caractères",
          },
          isActive: {
            label: "Statut actif",
            description:
              "Activer la visibilité dans les flux de travail de l'espace de travail",
          },
        },
        schemaFields: {
          title: "Champs du schéma",
          subtitle:
            "Définir les propriétés requises pour les éléments de cette catégorie.",
          addField: "Ajouter un champ",
          emptyState:
            'Aucun champ personnalisé ajouté. Cliquez sur "Ajouter un champ" pour configurer les attributs du schéma.',
          keyPlaceholder: "clé_champ (ex. numero_serie)",
          keyRequired: "La clé du champ est requise",
          keyPattern: "Lettres, chiffres et underscores uniquement",
          typeSelectPlaceholder: "Type",
          typeRequired: "Le type est requis",
          requiredShort: "Obl",
          types: {
            text: "Texte",
            number: "Nombre",
            boolean: "Booléen",
            date: "Date",
            json: "JSON",
            select: "Sélection",
          },
        },
        buttons: {
          cancel: "Annuler",
          submit: "Créer une catégorie",
          submitting: "Création en cours...",
        },
        zodValidation: {
          nameRequired: "Le nom de la catégorie est requis",
          nameMaxLength:
            "Le nom de la catégorie doit contenir moins de 100 caractères",
          descriptionMaxLength:
            "La description doit contenir moins de 500 caractères",
          typeRequired: "Le type de champ est requis",
          regexPattern:
            "Utilisez uniquement des lettres, des chiffres et des underscores",
          fieldNameRequired: "Le nom du champ est requis",
        },
        toast: {
          success: "Catégorie créée avec succès.",
          error: "Échec de la création de la catégorie. Veuillez réessayer.",
        },
      },
      modals: {
        deleteCategory: {
          title: "Supprimer la catégorie",
          subtitle:
            "Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.",
          warning:
            "La suppression de cette catégorie entraînera le retrait de sa configuration de schéma. Les éléments associés risquent de perdre leurs attributs personnalisés.",
          cancel: "Annuler",
          delete: "Supprimer la catégorie",
          deleting: "Suppression...",
          deleteSuccess: "Catégorie supprimée avec succès.",
          deleteError:
            "Échec de la suppression de la catégorie. Veuillez réessayer.",
        },
      },
      editCategoryForm: {
        title: "Modifier la catégorie",
        description:
          "Mettez à jour les détails de la catégorie et configurez les champs d'attributs personnalisés.",
        basicDetails: "Informations de base",
        fields: {
          name: {
            label: "Nom de la catégorie",
            placeholder: "ex. Électronique, Ordinateurs portables",
          },
          description: {
            label: "Description",
            placeholder: "Brève description de cette catégorie...",
          },
          isActive: {
            label: "Statut actif",
            description: "Commencez par créer votre première catégorie.",
          },
        },
        schemaFields: {
          title: "Champs du schéma",
          subtitle:
            "Définir les propriétés requises pour les éléments de cette catégorie.",
          addField: "Ajouter un champ",
          emptyState:
            'Aucun champ personnalisé ajouté. Cliquez sur "Ajouter un champ" pour configurer les attributs du schéma.',
          keyPlaceholder: "clé_champ (ex. numero_serie)",
          keyRequired: "La clé du champ est requise",
          keyPattern: "Lettres, chiffres et underscores uniquement",
          typeSelectPlaceholder: "Type",
          typeRequired: "Le type est requis",
          requiredShort: "Obl",
          types: {
            text: "Texte",
            number: "Nombre",
            boolean: "Booléen",
            date: "Date",
            json: "JSON",
            select: "Sélection",
          },
        },
        buttons: {
          cancel: "Annuler",
          submit: "Enregistrer les modifications",
          submitting: "Enregistrement...",
        },
        toast: {
          error: "Échec de la mise à jour de la catégorie. Veuillez réessayer.",
          success: "Catégorie mise à jour avec succès.",
        },
        zodValidation: {
          nameRequired: "Le nom de la catégorie est requis",
          nameMaxLength:
            "Le nom de la catégorie doit contenir moins de 100 caractères",
          descriptionMaxLength:
            "La description doit contenir moins de 500 caractères",
          typeRequired: "Le type de champ est requis",
          regexPattern:
            "Utilisez uniquement des lettres, des chiffres et des underscores",
          fieldNameRequired: "Le nom du champ est requis",
        },
      },
    },
    entities: {
      title: "Entités",
      subtitle: "Gérez les entités dans votre espace de travail",
      searchPlaceholder: "Rechercher par nom, référence ou catégorie...",
      noEntities: "Aucune entité trouvée",
      noEntitiesWithFilters:
        "Essayez d'ajuster vos filtres ou vos termes de recherche",
      noEntitiesEmpty: "Créez votre première entité pour commencer",
      newEntity: "Nouvelle entité",
      unknownCategory: "Catégorie inconnue",
      filters: {
        allCategories: "Toutes les catégories",
        allStatuses: "Tous les statuts",
      },
      statuses: {
        active: "Actif",
        archived: "Archivé",
      },
      noAttributes: "Aucun attribut",
      loading: "Chargement des entités...",
      noWorkspace:
        "Aucun espace de travail sélectionné. Choisissez un espace de travail pour voir les entités.",
      selectAll: "Tout sélectionner",
      selectEntity: "Sélectionner l'entité",
      table: {
        entity: "Entité",
        reference: "Référence",
        category: "Catégorie",
        status: "Statut",
        created: "Créé le",
        attributes: "Attributs",
        actions: "Actions",
      },
      detail: {
        viewDetails: "Voir les détails",
      },
      actions: {
        srLabel: "Actions",
        edit: "Modifier",
        duplicate: "Dupliquer",
        archive: "Archiver",
      },
      modals: {
        deleteEntity: {
          title: "Supprimer l'entité",
          subtitle:
            "Êtes-vous sûr de vouloir supprimer cette entité ? Cette action est irréversible.",
          warning:
            "La suppression de cette entité la retirera de l’espace de travail. Les attributs personnalisés associés à cette entité seront également supprimés.",
          cancel: "Annuler",
          delete: "Supprimer l'entité",
          deleting: "Suppression...",
          deleteSuccess: "Entité supprimée avec succès.",
          deleteError: "Échec de la suppression de l'entité. Veuillez réessayer.",
        },
      },
      "createEntityForm": {
        "title": "Créer une entité",
        "description": "Créez une entité à l'aide des champs définis par sa catégorie.",
        "basicDetails": "Informations de base",
        "fields": {
          "name": {
            "label": "Nom de l'entité",
            "placeholder": "Saisissez le nom de l'entité"
          },
          "category": {
            "label": "Catégorie",
            "placeholder": "Sélectionnez une catégorie"
          },
          "schemaVersion": "Version du schéma",
          "valuePlaceholder": "Saisissez {field}"
        },
        "attributes": {
          "title": "Attributs de l'entité",
          "description": "Les champs ci-dessous sont générés automatiquement à partir de la catégorie sélectionnée.",
          "noFields": "Cette catégorie ne contient aucun champ supplémentaire.",
          "selectCategory": "Sélectionnez une catégorie pour générer ses champs."
        },
        "validation": {
          "nameRequired": "Le nom de l'entité est obligatoire.",
          "nameMaxLength": "Le nom de l'entité doit comporter au maximum 255 caractères.",
          "categoryRequired": "La catégorie est obligatoire.",
          "fieldIdRequired": "Un identifiant de champ valide est requis.",
          "fieldRequired": "Ce champ est obligatoire.",
          "schemaNotFound": "Le schéma de la catégorie est introuvable.",
          "invalidNumber": "Veuillez saisir un nombre valide.",
          "invalidJson": "Veuillez saisir un JSON valide."
        },
        "buttons": {
          "cancel": "Annuler",
          "create": "Créer l'entité",
          "creating": "Création..."
        },
        "toast": {
          "success": "Entité créée avec succès.",
          "error": "Échec de la création de l'entité. Veuillez réessayer."
        }
      },
    },
  },
};