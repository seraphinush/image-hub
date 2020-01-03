using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ImageHub.Models
{
    public partial class ihubDBContext : DbContext
    {
        public ihubDBContext()
        {
        }

        public ihubDBContext(DbContextOptions<ihubDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Image> Image { get; set; }
        public virtual DbSet<Log> Log { get; set; }
        public virtual DbSet<LogLink> LogLink { get; set; }
        public virtual DbSet<Metadata> Metadata { get; set; }
        public virtual DbSet<Project> Project { get; set; }
        public virtual DbSet<ProjectLink> ProjectLink { get; set; }
        public virtual DbSet<Tag> Tag { get; set; }
        public virtual DbSet<TagLink> TagLink { get; set; }
        public virtual DbSet<User> User { get; set; }
        /*
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=tcp:g4g1b.database.windows.net,1433;Initial Catalog=ihubDB;Persist Security Info=False;User ID=g4g1b;Password=nlgpsag777!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");
            }
        }
        */
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Image>(entity =>
            {
                entity.HasKey(e => e.IId);

                entity.HasIndex(e => new { e.Trashed, e.UId, e.TrashedDate });

                entity.HasIndex(e => new { e.UId, e.Trashed, e.Submitted });

                entity.Property(e => e.IId)
                    .HasColumnName("IId")
                    .HasMaxLength(128)
                    .ValueGeneratedNever();

                entity.Property(e => e.ImageName)
                    .IsRequired()
                    .HasMaxLength(128);

                entity.Property(e => e.TrashedDate).HasColumnType("datetime");

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.UId)
                    .IsRequired()
                    .HasColumnName("UId")
                    .HasMaxLength(128);

                entity.Property(e => e.UploadedBy)
                .IsRequired()
                .HasMaxLength(128);

                entity.Property(e => e.UploadedDate).HasColumnType("datetime");

                entity.HasOne(d => d.U)
                    .WithMany(p => p.Image)
                    .HasForeignKey(d => d.UId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Image");
            });

            modelBuilder.Entity<Log>(entity =>
            {
                entity.HasKey(e => e.LId);

                entity.HasIndex(e => e.CreatedDate);

                entity.HasIndex(e => e.UId);

                entity.Property(e => e.LId)
                    .HasColumnName("LId")
                    .HasMaxLength(128)
                    .ValueGeneratedNever();

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.LogFile)
                    .IsRequired()
                    .HasMaxLength(1000);

                entity.Property(e => e.UId)
                    .IsRequired()
                    .HasColumnName("UId")
                    .HasMaxLength(128);

                entity.HasOne(d => d.U)
                    .WithMany(p => p.Log)
                    .HasForeignKey(d => d.UId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Log");
            });

            modelBuilder.Entity<LogLink>(entity =>
            {
                entity.HasKey(e => e.LlinkId);
                
                entity.HasIndex(e => new { e.LId, e.IId });

                entity.Property(e => e.LlinkId).HasColumnName("LLinkId");
                
                entity.Property(e => e.IId)
                    .IsRequired()
                    .HasColumnName("IId")
                    .HasMaxLength(128);

                entity.Property(e => e.LId)
                    .IsRequired()
                    .HasColumnName("LId")
                    .HasMaxLength(128);
                
                entity.HasOne(d => d.I)
                    .WithMany(p => p.LogLink)
                    .HasForeignKey(d => d.IId)
                    .HasConstraintName("FK_LogLink2");

                entity.HasOne(d => d.L)
                    .WithMany(p => p.LogLink)
                    .HasForeignKey(d => d.LId)
                    .HasConstraintName("FK_LogLink1");
                    
            });

            modelBuilder.Entity<Metadata>(entity =>
            {
                entity.HasKey(e => e.MetaName);

                entity.Property(e => e.MetaName)
                    .HasMaxLength(128)
                    .ValueGeneratedNever();
            });

            modelBuilder.Entity<Project>(entity =>
            {
                entity.HasKey(e => e.ProjectName);

                entity.Property(e => e.ProjectName)
                    .HasMaxLength(128)
                    .ValueGeneratedNever();

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(1000);
            });

            modelBuilder.Entity<ProjectLink>(entity =>
            {
                entity.HasKey(e => e.PlinkId);

                entity.HasIndex(e => new { e.IId, e.ProjectName });

                entity.Property(e => e.PlinkId).HasColumnName("PLinkId");

                entity.Property(e => e.IId)
                    .IsRequired()
                    .HasColumnName("IId")
                    .HasMaxLength(128);

                entity.Property(e => e.ProjectName)
                    .IsRequired()
                    .HasMaxLength(128);

                entity.HasOne(d => d.I)
                    .WithMany(p => p.ProjectLink)
                    .HasForeignKey(d => d.IId)
                    .HasConstraintName("FK_ProjectLink2");

                entity.HasOne(d => d.ProjectNameNavigation)
                    .WithMany(p => p.ProjectLink)
                    .HasForeignKey(d => d.ProjectName)
                    .HasConstraintName("FK_ProjectLink1");
            });

            modelBuilder.Entity<Tag>(entity =>
            {
                entity.HasKey(e => e.TagName);

                entity.Property(e => e.TagName)
                    .HasMaxLength(128)
                    .ValueGeneratedNever();

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(1000);
            });

            modelBuilder.Entity<TagLink>(entity =>
            {
                entity.HasKey(e => e.TlinkId);

                entity.HasIndex(e => new { e.IId, e.TagName });

                entity.Property(e => e.TlinkId).HasColumnName("TLinkId");

                entity.Property(e => e.IId)
                    .IsRequired()
                    .HasColumnName("IId")
                    .HasMaxLength(128);

                entity.Property(e => e.TagName)
                    .IsRequired()
                    .HasMaxLength(128);

                entity.HasOne(d => d.I)
                    .WithMany(p => p.TagLink)
                    .HasForeignKey(d => d.IId)
                    .HasConstraintName("FK_TagLink2");

                entity.HasOne(d => d.TagNameNavigation)
                    .WithMany(p => p.TagLink)
                    .HasForeignKey(d => d.TagName)
                    .HasConstraintName("FK_TagLink1");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UId);

                entity.HasIndex(e => e.Active);

                entity.Property(e => e.UId)
                    .HasColumnName("UId")
                    .HasMaxLength(128)
                    .ValueGeneratedNever();

                entity.Property(e => e.Role).HasMaxLength(10);

                entity.Property(e => e.UserName)
                    .IsRequired()
                    .HasMaxLength(128);
            });
        }
    }
}
